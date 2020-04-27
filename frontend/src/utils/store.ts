import {combineReducers, createStore} from 'redux'

import lobbyReducer, {LobbyState} from './reducers/lobby/lobbyReducer'
import gameReducer, {GameState} from './reducers/game/gameReducer'
import userReducer, {UserState} from './reducers/user/userReducer'

export interface ChessStore {
  lobby: LobbyState;
  game: GameState;
  user: UserState;
}

const reducers = combineReducers<ChessStore>({
  lobby: lobbyReducer,
  game: gameReducer,
  user: userReducer
})

const devToolsEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__

export const store = createStore(
  reducers,
  devToolsEnhancer && devToolsEnhancer()
)