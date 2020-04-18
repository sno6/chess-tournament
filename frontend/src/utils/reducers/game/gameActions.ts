import {Action} from 'redux'

import {GameResult} from '../../GameResult'

export enum GameActionType {
  Started = 'game_started',
  Updated = 'game_updated',
  Ended = 'game_ended'
}

export interface GameUpdateActionPayload {
  state: string;
}

export interface GameUpdatedAction extends Action {
  type: GameActionType.Updated;
  payload: GameUpdateActionPayload;
}

export function gameUpdated(
  payload: GameUpdateActionPayload
): GameUpdatedAction {
  return {
    type: GameActionType.Updated,
    payload
  }
}

export interface GameStartedActionPayload {
  white: string;
  black: string;
}

export interface GameStartedAction extends Action {
  type: GameActionType.Started;
  payload: GameStartedActionPayload;
}

export function gameStarted(
  payload: GameStartedActionPayload
): GameStartedAction {
  return {
    type: GameActionType.Started,
    payload
  }
}

export interface GameEndedActionPayload {
  result: GameResult;
}

export interface GameEndedAction extends Action {
  type: GameActionType.Ended;
  payload: GameEndedActionPayload;
}

export function gameEnded(payload: GameEndedActionPayload): GameEndedAction {
  return {
    type: GameActionType.Ended,
    payload
  }
}

export type GameActions =
  GameStartedAction | GameUpdatedAction | GameEndedAction