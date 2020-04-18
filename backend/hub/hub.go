package hub

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/sno6/chess-tournament/backend/chess/tournament"
	"github.com/sno6/chess-tournament/backend/connection"
	"github.com/sno6/chess-tournament/backend/event"
	"github.com/sno6/chess-tournament/backend/user"
)

const wsPath = "/ws/hub"
const pollDuration = 10 * time.Second

type Hub struct {
	mux   sync.Mutex
	users map[*websocket.Conn]*user.User

	connector *connection.Connector
	events    chan *event.HubEvent

	cfg    *Config
	logger *log.Logger
}

type Config struct {
	Addr string
}

func New(cfg *Config) *Hub {
	logger := log.New(os.Stdout, "[HUB] ", log.LstdFlags)
	events := make(chan *event.HubEvent)

	return &Hub{
		cfg:       cfg,
		logger:    logger,
		events:    events,
		connector: connection.NewConnector(logger, events),
		users:     make(map[*websocket.Conn]*user.User),
	}
}

func (h *Hub) Start() error {
	go h.startEventListener()
	go h.tournamentPoller()

	mux := http.NewServeMux()
	mux.HandleFunc(wsPath, h.connector.HandleConnection)

	return http.ListenAndServe(h.cfg.Addr, mux)
}

func (h *Hub) startEventListener() {
	for {
		var err error
		e := <-h.events

		switch e.Action {
		case event.Connect:
			err = h.connect(e)
		case event.Disconnect:
			err = h.disconnect(e)
		case event.UserRegister:
			err = h.userRegister(e)
		case event.UserMoved:
			err = h.userMoved(e)
			break
		case event.UserOfferedDraw:
			break
		case event.UserResigned:
			break
		}

		if err != nil {
			h.logger.Printf("Error occured during action: %v: %v\n", e.Action, err)
		}
	}
}

// tournamentPoller polls every N seconds and starts a tournament with members
// of the lobby (not in a current tournament).
func (h *Hub) tournamentPoller() {
	t := time.NewTicker(pollDuration)
	for _ = range t.C {
		users := h.eligibleUsers()
		fmt.Println(len(users), " are ready for tournament")
		if len(users) == tournament.MinNeededUsers {
			tourny := tournament.New(users)
			go tourny.Start()
		}
	}
}

func (h *Hub) connect(e *event.HubEvent) error {
	h.mux.Lock()
	h.users[e.Conn] = &user.User{Name: nil, Conn: e.Conn, MoveStream: make(chan string)}
	h.mux.Unlock()

	return nil
}

func (h *Hub) disconnect(e *event.HubEvent) error {
	h.mux.Lock()
	delete(h.users, e.Conn)
	h.mux.Unlock()

	return nil
}

func (h *Hub) userRegister(e *event.HubEvent) error {
	re, ok := e.Payload.(event.RegisterEvent)
	if !ok {
		return event.ErrParsing
	}

	h.mux.Lock()
	h.users[e.Conn].Name = &re.Name
	h.users[e.Conn].Registered = true
	h.mux.Unlock()

	h.logger.Printf("New user %s has registered for a tournament\n", re.Name)
	return nil
}

func (h *Hub) userMoved(e *event.HubEvent) error {
	u := h.users[e.Conn]
	if u.Status != user.InMatch {
		return errors.New("invalid move: user is not currently in a game")
	}

	move, ok := e.Payload.(event.UserMovedEvent)
	if !ok {
		return event.ErrParsing
	}

	// Only send the move if its this users turn..
	select {
	case u.MoveStream <- move.Move:
		break
	default:
		break
	}

	return nil
}

func (h *Hub) eligibleUsers() []*user.User {
	var users []*user.User

	for _, u := range h.users {
		if u.Registered == true && u.Status == user.InTournamentLobby {
			users = append(users, u)
		}
	}

	return users
}
