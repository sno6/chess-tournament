package event

type Action string

const (
	// System actions.
	Connect    Action = "Connect"
	Disconnect        = "Disconnect"

	// User recieved actions.
	UserRegister     = "UserRegister"
	UserMoved        = "UserMoved"
	UserResigned     = "UserResigned"
	UserOfferedDraw  = "UserOfferedDraw"
	UserAcceptedDraw = "UserAcceptedDraw"
	UserDeclinedDraw = "UserDeclinedDraw"

	// User sent actions.
	LobbyUpdate       = "LobbyUpdate"
	InvalidMove       = "InvalidMove"
	BoardState        = "BoardState"
	MatchStarted      = "MatchStarted"
	MatchOutcome      = "MatchOutcome"
	TournamentStarted = "TournamentStarted"
	TournamentOutcome = "TournamentOutcome"
)
