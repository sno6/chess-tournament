package connection

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/sno6/chess-tournament/backend/event"
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
	CheckOrigin: func(r *http.Request) bool { // REMNOVE
		return true
	},
}

type Connector struct {
	logger *log.Logger
	events chan *event.HubEvent
}

func NewConnector(logger *log.Logger, events chan *event.HubEvent) *Connector {
	return &Connector{
		logger: logger,
		events: events,
	}
}

func WriteEvent(conn *websocket.Conn, event *event.HubEvent) error {
	// Write the event to the connection?
	return nil
}

func (c *Connector) HandleConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		c.logger.Printf("Error initialising new connection: %v\n", err)
	}

	conn.SetReadLimit(maxMessageSize)
	conn.SetReadDeadline(time.Now().Add(pongWait))
	conn.SetPongHandler(func(string) error { conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	go c.startPingHandler(conn)

	// Register the new connection with the hub.
	c.events <- &event.HubEvent{
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

		hubEvent, err := event.ParseRawEvent(t, msg)
		if err != nil {
			c.logger.Printf("Error parsing raw event: %v", err)
			continue
		}

		c.events <- &event.HubEvent{
			Action:  hubEvent.Action,
			Payload: hubEvent.Payload,
			Conn:    conn,
		}
	}

	// There was an unexpected issue closure, notify the hub and safely disconnect.
	conn.Close()
	c.events <- &event.HubEvent{
		Action: event.Disconnect,
		Conn:   conn,
	}
}

func (c *Connector) startPingHandler(conn *websocket.Conn) {
	ticker := time.NewTicker(pingPeriod)

	defer func() {
		ticker.Stop()
		conn.Close()
	}()

	for {
		select {
		case <-ticker.C:
			conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				c.logger.Printf("Error pinging client: %v\n", err)
				return
			}
		}
	}
}
