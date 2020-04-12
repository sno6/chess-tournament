package match

import (
	"fmt"

	"github.com/sno6/chess-tournament/backend/user"
)

type Match struct {
	Black *user.User
	White *user.User
}

func New(black *user.User, white *user.User) *Match {
	return &Match{
		Black: black,
		White: white,
	}
}

func (m *Match) Start() {
	fmt.Println("Starting match")
}
