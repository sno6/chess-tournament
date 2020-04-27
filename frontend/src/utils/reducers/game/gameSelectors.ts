import {createSelector} from 'reselect'

import {ChessStore} from '../../store'
import {PlayerColor} from '../../PlayerColor'
import {userSelector} from '../user/userSelectors'

export const gameSelector = (state: ChessStore) => state.game

export const gameStatusSelector = createSelector(
  gameSelector,
  game => game.status
)

export const colorSelector = createSelector(
  gameSelector,
  userSelector,
  (game, user) =>
    user.isRegistered && game.white
      ? user.name === game.white.name
        ? PlayerColor.White
        : PlayerColor.Black
      : null
)

export const playersSelector = createSelector(
  gameSelector,
  game => ({
    white: game.white,
    black: game.black
  })
)

export const fenSelector = createSelector(
  gameSelector,
  game => game.fen
)