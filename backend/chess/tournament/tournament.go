package tournament

import (
	"log"
	"math/rand"
	"time"

	"github.com/sno6/chess-tournament/backend/chess/match"
	"github.com/sno6/chess-tournament/backend/connection"
	"github.com/sno6/chess-tournament/backend/event"
	"github.com/sno6/chess-tournament/backend/user"
)

const MinNeededUsers = 2

func init() {
	rand.Seed(time.Now().Unix())
}

type Tournament struct {
	users   []*user.User
	matches []*match.Match

	resultsChan chan *match.Result
}

func New(users []*user.User) *Tournament {
	return &Tournament{
		users:       users,
		resultsChan: make(chan *match.Result),
	}
}

func (t *Tournament) Start() {
	t.shuffleUsers()
	t.setUserStatus(user.InMatch)

	t.broadcast(&event.HubEvent{
		Action:  event.TournamentStarted,
		Payload: nil,
	})

	// Setup the first round matches..
	roundOne := make([]*match.Match, len(t.users)/2)
	for i := 0; i < len(roundOne); i++ {
		m := match.New(t.users[i*2], t.users[i*2+1])
		roundOne[i] = m

		go m.Start(t.resultsChan)
	}

	// Result of the match.
	res := <-t.resultsChan

	t.broadcast(&event.HubEvent{
		Action: event.TournamentEnded,
		Payload: &event.TournamentEndedEvent{
			Winner: *res.Winner.Name,
		},
	})

	t.setUserStatus(user.InTournamentLobby)
}

func (t *Tournament) shuffleUsers() {
	rand.Shuffle(len(t.users), func(i, j int) { t.users[i], t.users[j] = t.users[j], t.users[i] })
}

func (t *Tournament) setUserStatus(status user.Status) {
	for _, u := range t.users {
		u.Status = status
	}
}

func (t *Tournament) broadcast(e *event.HubEvent) {
	for _, u := range t.users {
		go func(u *user.User) {
			err := connection.WriteEvent(u, e)
			if err != nil {
				log.Printf("Error writing event to user %s\n", *u.Name)
			}
		}(u)
	}
}
