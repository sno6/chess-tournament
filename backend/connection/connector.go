package connection

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/sno6/chess-tournament/event"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Connector struct {
	logger *log.Logger
	events chan *event.Event
}

func NewConnector(logger *log.Logger, events chan *event.Event) *Connector {
	return &Connector{
		logger: logger,
		events: events,
	}
}

func (c *Connector) HandleConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		c.logger.Printf("Error initialising new connection: %v\n", err)
	}

	conn.SetReadLimit(maxMessageSize)
	conn.SetReadDeadline(time.Now().Add(pongWait))
	conn.SetPongHandler(func(string) error { conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	// Register the new connection with the hub.
	c.events <- &event.Event{
		Action: event.Connect,
		Conn:   conn,
	}

	// Handle the connection lifecycle.
	for {
		t, msg, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				c.logger.Printf("Connection error: %v", err)
			}
			break
		}

		fmt.Printf("Recieved message of type: %v and data: %v\n", t, msg)
	}

	// There was an unexpected connection closure, notify the hub and safely disconnect.
	conn.Close()
	c.events <- &event.Event{
		Action: event.Disconnect,
		Conn:   conn,
	}
}
