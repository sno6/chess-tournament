package event

import "github.com/gorilla/websocket"

type Event struct {
	Action  Action
	Payload interface{}
	Conn    *websocket.Conn
}
