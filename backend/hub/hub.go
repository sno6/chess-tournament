package hub

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/sno6/chess-tournament/backend/chess/tournament"
	"github.com/sno6/chess-tournament/backend/connection"
	"github.com/sno6/chess-tournament/backend/event"
	"github.com/sno6/chess-tournament/backend/user"
)

const wsPath = "/ws/hub"

type Hub struct {
	activeTournaments []*tournament.Tournament
	users             map[*websocket.Conn]*user.User

	connector *connection.Connector
	events    chan *event.HubEvent

	cfg    *Config
	logger *log.Logger
}

type Config struct {
	Addr string
}

func New(cfg *Config) *Hub {
	logger := log.New(os.Stdout, "[HUB]", log.LstdFlags)
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

func (h *Hub) connect(e *event.HubEvent) error {
	h.users[e.Conn] = &user.User{Name: nil, Conn: e.Conn}
	return nil
}

func (h *Hub) disconnect(e *event.HubEvent) error {
	delete(h.users, e.Conn)
	return nil
}

func (h *Hub) userRegister(e *event.HubEvent) error {
	re, ok := e.Payload.(event.RegisterEvent)
	if !ok {
		return event.ErrParsing
	}

	h.users[e.Conn].Name = &re.Name
	h.users[e.Conn].Registered = true

	// If there are enough users registered start a tournament.
	users := h.readyUsers()
	if len(users) == tournament.MinNeededUsers {
		tourny := tournament.New(users)
		go tourny.Start()

		h.activeTournaments = append(h.activeTournaments, tourny)
	}

	return nil
}

func (h *Hub) userMoved(e *event.HubEvent) error {
	move, ok := e.Payload.(event.UserMovedEvent)
	if !ok {
		return event.ErrParsing
	}

	// Find the tournament this user is in, pass through
	// Find game in tournament, pass through.
	// Check legality.
	fmt.Println(move.Move)

	return nil
}

func (h *Hub) readyUsers() []*user.User {
	var users []*user.User

	for _, u := range h.users {
		// Get all users that are registered, connected and not currently in a tournament.
		if u.Registered == true && !u.InTournament {
			users = append(users, u)
		}
	}

	return users
}
