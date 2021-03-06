package event

import (
	"encoding/json"

	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
)

var (
	ErrParsing            = errors.New("error while parsing payload of event")
	ErrUnrecognizerAction = errors.New("unrecognized action")
)

type HubEvent struct {
	Action  Action          `json:"action"`
	Payload interface{}     `json:"payload"`
	Conn    *websocket.Conn `json:"-"`
}

type RawEvent struct {
	Action  Action          `json:"action"`
	Payload json.RawMessage `json:"payload"`
}

type LobbyUpdateEvent struct {
	Connected  int      `json:"connected"`
	Registered []string `json:"registered"`
}

type RegisterEvent struct {
	Name string `json:"name"`
}

type UserMovedEvent struct {
	Move string `json:"move"`
}

type BoardStateEvent struct {
	State string `json:"state"`
}

type TournamentOutcomeEvent struct {
	Winner string `json:"winner"`
}

type MatchStartedEvent struct {
	White string `json:"white"`
	Black string `json:"black"`
}

func ParseRawEvent(t int, msg []byte) (*HubEvent, error) {
	if t != websocket.TextMessage {
		return nil, errors.New("Invalid websocket event type")
	}

	var raw RawEvent
	if err := json.Unmarshal(msg, &raw); err != nil {
		return nil, errors.Wrap(ErrParsing, err.Error())
	}

	// Bloody Go and it's no bloody generics.
	switch raw.Action {
	case UserRegister:
		var val RegisterEvent
		if err := json.Unmarshal(raw.Payload, &val); err != nil {
			return nil, errors.Wrap(ErrParsing, err.Error())
		}
		return &HubEvent{
			Action:  raw.Action,
			Payload: val,
		}, nil
	case UserMoved:
		var val UserMovedEvent
		if err := json.Unmarshal(raw.Payload, &val); err != nil {
			return nil, errors.Wrap(ErrParsing, err.Error())
		}
		return &HubEvent{
			Action:  raw.Action,
			Payload: val,
		}, nil
	}

	return nil, ErrUnrecognizerAction
}
