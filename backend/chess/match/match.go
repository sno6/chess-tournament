package match

import (
	"time"

	"github.com/notnil/chess"
	"github.com/sno6/chess-tournament/backend/user"
)

type Match struct {
	Black *user.User
	White *user.User
}

type Result struct {
	Match *Match

	Winner *user.User
	Method chess.Method
}

func New(black *user.User, white *user.User) *Match {
	return &Match{
		Black: black,
		White: white,
	}
}

func (m *Match) Start(resultChan chan<- *Result) {
	// game := chess.NewGame()
	time.Sleep(time.Second * 15)

	res := &Result{
		Winner: m.White,
		Method: chess.Checkmate,
	}

	resultChan <- res
	// Get input
	// for {
	// Get white move.
	// Check validity.
	// Check result from move..
	// Broadcast to users...

	// Get Black move.
	// Check validity.
	// Check result from move...
	// Broadcast move to users...
	// }
}
