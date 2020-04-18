package user

import "github.com/gorilla/websocket"

type User struct {
	Name *string
	Conn *websocket.Conn

	MoveStream chan string

	Registered bool
	Status     Status
}

type Status int

const (
	InTournamentLobby Status = iota
	InMatch
)
