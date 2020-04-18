import {GameActions, GameActionType, GameStartedAction} from './gameActions'
import {User} from '../../User'
import {GameStatus} from '../../GameStatus'
import {GameResult} from '../../GameResult'

export interface GameState {
  white: null | User;
  black: null | User;
  status: null | GameStatus;
  result: null | GameResult;
}

const initialState = {
  white: null,
  black: null,
  status: null,
  result: null
}

export default function gameReducer(
  state: GameState = initialState,
  action: GameActions
): GameState {
  const {type} = action
  switch (type) {
    case GameActionType.Started: {
      const {payload} = action as GameStartedAction
      return {
        white: { name: payload.white },
        black: { name: payload.black },
        status: GameStatus.Ready,
        result: null
      }
    }
    default:
      return state
  }
}