package tournament

import "github.com/sno6/chess-tournament/backend/user"

const MinNeededUsers = 4

type Tournament struct {
}

func New() *Tournament {
	return &Tournament{}
}
func (t *Tournament) AddUsers(users ...*user.User) {}
func (t *Tournament) Start()                       {}
