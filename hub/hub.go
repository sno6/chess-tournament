package hub

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
	"github.com/sno6/chess-tournament/connection"
	"github.com/sno6/chess-tournament/event"
)

const wsPath = "/ws/hub"

type Hub struct {
	users map[*websocket.Conn]*User

	connector *connection.Connector
	events    chan *event.Event

	cfg    *Config
	logger *log.Logger
}

type Config struct {
	Addr string
}

func New(cfg *Config) *Hub {
	logger := log.New(os.Stdout, "[HUB]", log.LstdFlags)
	events := make(chan *event.Event)

	return &Hub{
		cfg:       cfg,
		logger:    logger,
		events:    events,
		connector: connection.NewConnector(logger, events),
		users:     make(map[*websocket.Conn]*User),
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
		case event.Register:
			err = h.register(e)
		}

		if err != nil {
			h.logger.Printf("Error occured during action: %v: %v\n", e.Action, err)
		}
	}
}

func (h *Hub) connect(e *event.Event) error {
	h.users[e.Conn] = &User{name: nil}
	return nil
}

func (h *Hub) disconnect(e *event.Event) error {
	delete(h.users, e.Conn)
	return nil
}

func (h *Hub) register(e *event.Event) error {
	h.logger.Println("User registered, there are %d users online.", len(h.registeredUsers()))
	return nil
}

func (h *Hub) registeredUsers() []*User {
	var users []*User
	for _, u := range h.users {
		if u.name != nil {
			users = append(users, u)
		}
	}
	return users
}
