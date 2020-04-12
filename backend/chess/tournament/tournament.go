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
}

func New() *Tournament {
	return &Tournament{}
}

func (t *Tournament) AddUsers(users ...*user.User) {
	for _, u := range users {
		fmt.Println(*u.Name)
	}
}

func (t *Tournament) Start() {
	fmt.Println("Tournament starting...")

	if len(t.users)%2 != 0 {
		panic("Tournament has started without sufficient numbers")
	}

	users := shuffleUsers(t.users)
	matches := make([]*match.Match, len(users)/2)

	for i := 0; i < len(matches); i += 1 {
		m := match.New(users[i*2], users[i*2+1])
		matches[i] = m

		go m.Start()
	}
}

func shuffleUsers(users []*user.User) []*user.User {
	rand.Shuffle(len(users), func(i, j int) { users[i], users[j] = users[j], users[i] })
	return users
}
