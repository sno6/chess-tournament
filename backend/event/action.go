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

	// User sent actions.
	BoardState
	GameOutcome
)
