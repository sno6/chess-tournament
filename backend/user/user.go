package user

import "github.com/gorilla/websocket"

type User struct {
	Name *string
	Conn *websocket.Conn

	Registered   bool
	InTournament bool
}
