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
		}

		if err != nil {
			h.logger.Printf("Error occured during action: %v: %v\n", e.Action, err)
		}
	}
}

func (h *Hub) connect(e *event.HubEvent) error {
	fmt.Println("Connection")

	h.users[e.Conn] = &user.User{Name: nil}
	return nil
}

func (h *Hub) disconnect(e *event.HubEvent) error {
	fmt.Println("Disconnect")

	delete(h.users, e.Conn)
	return nil
}

func (h *Hub) userRegister(e *event.HubEvent) error {
	fmt.Println("User Register")

	fmt.Printf("+%v\n", e)

	if _, ok := e.Payload.(*event.RegisterEvent); !ok {
		return event.ErrParsing
	}

	users := h.registeredUsers()
	if len(users) == tournament.MinNeededUsers {
		tourny := tournament.New()
		tourny.AddUsers(users...)
		tourny.Start()
	}

	return nil
}

func (h *Hub) registeredUsers() []*user.User {
	var users []*user.User
	for _, u := range h.users {
		if u.Name != nil {
			users = append(users, u)
		}
	}
	return users
}
