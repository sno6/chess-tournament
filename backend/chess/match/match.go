package match

import (
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
	// game := chess.NewGame()

	// Get input
	for {
		// Get white move.
		// Check validity.
		// Check result from move..
		// Broadcast to users...

		// Get Black move.
		// Check validity.
		// Check result from move...
		// Broadcast move to users...
	}
}
