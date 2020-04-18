package match

import (
	"log"

	"github.com/notnil/chess"
	"github.com/sno6/chess-tournament/backend/connection"
	"github.com/sno6/chess-tournament/backend/event"
	"github.com/sno6/chess-tournament/backend/user"
)

type Match struct {
	game  *chess.Game
	Black *user.User
	White *user.User
}

type Result struct {
	Winner  *user.User
	Outcome chess.Outcome
}

func New(black *user.User, white *user.User) *Match {
	return &Match{
		game:  chess.NewGame(),
		Black: black,
		White: white,
	}
}

func (m *Match) Start(resultChan chan<- *Result) {
	m.broadcast(&event.HubEvent{
		Action: event.MatchStarted,
		Payload: &event.MatchStartedEvent{
			White: *m.White.Name,
			Black: *m.Black.Name,
		},
	})

	for {
		m.handleMove(m.White)
		if m.game.Outcome() != chess.NoOutcome {
			break
		}

		m.broadcast(&event.HubEvent{
			Action: event.BoardState,
			Payload: &event.BoardStateEvent{
				State: m.game.FEN(),
			},
		})

		m.handleMove(m.Black)
		if m.game.Outcome() != chess.NoOutcome {
			break
		}

		m.broadcast(&event.HubEvent{
			Action: event.BoardState,
			Payload: &event.BoardStateEvent{
				State: m.game.FEN(),
			},
		})
	}

	var winner *user.User
	if m.game.Outcome() == chess.BlackWon {
		winner = m.Black
	} else if m.game.Outcome() == chess.WhiteWon {
		winner = m.White
	}

	resultChan <- &Result{
		Winner:  winner,
		Outcome: m.game.Outcome(),
	}
}

func (m *Match) broadcast(e *event.HubEvent) {
	for _, u := range []*user.User{m.White, m.Black} {
		go func(u *user.User) {
			err := connection.WriteEvent(u, e)
			if err != nil {
				log.Println("Error reporting to client about error lol", err)
			}
		}(u)
	}
}

func (m *Match) handleMove(u *user.User) string {
	// TODO: Implement some sane timeout here.

	for {
		move := <-u.MoveStream
		err := m.game.MoveStr(move)

		if err == nil {
			return move
		}

		log.Printf("Illegal move detected: %s\n", move)

		// handle err.
		err = connection.WriteEvent(u, &event.HubEvent{
			Action: event.InvalidMove,
			Payload: &event.UserMovedEvent{
				Move: move,
			},
		})
		if err != nil {
			log.Println("Error reporting to client about error lol")
		}
	}
}
