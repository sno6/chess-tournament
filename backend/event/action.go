package event

type Action uint

const (
	// System actions.
	Connect Action = iota
	Disconnect

	// User recieved actions.
	UserRegister
	UserMoved
	UserResigned
	UserOfferedDraw
	UserAcceptedDraw
	UserDeclinedDraw

	// User sent actions.
	LobbyUpdate
	InvalidMove
	BoardState
	MatchStarted
	MatchOutcome
	TournamentStarted
	TournamentOutcome
)
