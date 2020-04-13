package tournament

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/sno6/chess-tournament/backend/chess/match"
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
	fmt.Println("Tournament started, goodluck")

	if len(t.users)%2 != 0 {
		panic("Tournament has started without sufficient numbers")
	}

	// t.shuffleUsers()
	t.setUserStatus(true)

	matches := make([]*match.Match, len(t.users)/2)
	for i := 0; i < len(matches); i++ {
		m := match.New(t.users[i*2], t.users[i*2+1])
		matches[i] = m

		// Run each game in its own thread.
		go m.Start(t.resultsChan)
	}

	// Block until all of the games in the tournament have been completed.
	var matchesCompleted int
	for {
		res := <-t.resultsChan

		fmt.Printf("Game Finished: %v won\n", *res.Winner.Name)
		matchesCompleted++

		if matchesCompleted == len(matches) {
			break
		}
	}

	fmt.Println("All games are finished... who won?")
	t.setUserStatus(false)
}

func (t *Tournament) shuffleUsers() {
	rand.Shuffle(len(t.users), func(i, j int) { t.users[i], t.users[j] = t.users[j], t.users[i] })
}

func (t *Tournament) setUserStatus(inTourny bool) {
	for _, u := range t.users {
		fmt.Printf("Setting %s tourny val to %v\n", *u.Name, inTourny)
		u.InTournament = inTourny
	}
}
