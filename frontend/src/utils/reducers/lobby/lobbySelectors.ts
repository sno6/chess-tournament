import {createSelector} from 'reselect'

import {ChessStore} from '../../store'
import {User} from '../../User'

export const lobbySelector = (state: ChessStore) => state.lobby

export const connectedUsersSelector = createSelector(
  lobbySelector,
  lobby => lobby.connectedUsers
)

export const registeredUsersSelector = createSelector(
  lobbySelector,
  lobby => lobby.registeredUsers.map(name => ({name } as User))
)