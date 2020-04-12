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
	Action  Action
	Payload interface{}
	Conn    *websocket.Conn
}

type RawEvent struct {
	Action  Action          `json:"action"`
	Payload json.RawMessage `json:"payload"`
}

type RegisterEvent struct {
	Name string `json:"name"`
}

func ParseRawEvent(t int, msg []byte) (*HubEvent, error) {
	if t != websocket.TextMessage {
		return nil, errors.New("Invalid websocket event type")
	}

	var raw RawEvent
	if err := json.Unmarshal(msg, &raw); err != nil {
		return nil, errors.Wrap(ErrParsing, err.Error())
	}

	switch raw.Action {
	case UserRegister:
		var re RegisterEvent
		if err := json.Unmarshal(raw.Payload, &re); err != nil {
			return nil, errors.Wrap(ErrParsing, err.Error())
		}

		return &HubEvent{
			Action:  raw.Action,
			Payload: re,
		}, nil
	}

	return nil, ErrUnrecognizerAction
}
