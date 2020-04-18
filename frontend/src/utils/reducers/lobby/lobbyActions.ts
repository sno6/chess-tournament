import {Action} from 'redux'

export enum LobbyActionType {
  Update = 'lobby_update'
}

export interface LobbyUpdateActionPayload {
  connected: number;
  registered: null | string[];
}

export interface LobbyUpdateAction extends Action {
  payload: LobbyUpdateActionPayload;
}

export function lobbyUpdate(
  payload: LobbyUpdateActionPayload
): LobbyUpdateAction {
  return {
    type: LobbyActionType.Update,
    payload
  }
}

export type LobbyActions = LobbyUpdateAction