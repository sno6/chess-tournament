import {GameActions, GameActionType, GameStartedAction, GameUpdatedAction} from './gameActions'
import {User} from '../../User'
import {GameStatus} from '../../GameStatus'
import {GameResult} from '../../GameResult'

export interface GameState {
  white: null | User;
  black: null | User;
  status: GameStatus;
  result: GameResult;
  fen: string;
}

const initialState = {
  white: null,
  black: null,
  status: GameStatus.NotStarted,
  result: GameResult.None,
  fen: ''
  // white: {name: 'Tester'},
  // black: {name: 'Chester'},
  // status: GameStatus.Ready,
  // result: GameResult.None
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
        result: GameResult.None,
        fen: '',
      }
    }
    case GameActionType.Updated: {
      const {payload} = action as GameUpdatedAction
      return {
        ...state,
        fen: payload.state
      }
    }
    default:
      return state
  }
}