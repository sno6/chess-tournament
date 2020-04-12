package event

type Action uint

const (
	// System actions.
	Connect Action = iota
	Disconnect

	// User actions.
	UserRegister
)
