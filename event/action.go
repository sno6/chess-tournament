package event

type Action int

const (
	// System actions.
	Connect Action = iota
	Disconnect

	// User actions.
	Register
)
