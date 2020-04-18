import {LobbyActions, LobbyActionType, LobbyUpdateAction} from './lobbyActions'

export interface LobbyState {
  connectedUsers: number;
  registeredUsers: string[];
}

const initialState = {
  connectedUsers: 0,
  registeredUsers: []
}

export default function lobbyReducer(
  state: LobbyState = initialState,
  action: LobbyActions
): LobbyState {
  const {type} = action
  switch (type) {
    case LobbyActionType.Update: {
      const {payload} = action as LobbyUpdateAction
      return {
        connectedUsers: payload.connected,
        registeredUsers: payload.registered || []
      }
    }
    default:
      return state
  }
}