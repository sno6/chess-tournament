import {UserActions, UserActionType, UserUpdateAction} from './userActions'

export interface UserState {
  name: string;
  isRegistered: boolean;
}

const initialState = {
  name: '',
  isRegistered: false
}

export default function lobbyReducer(
  state: UserState = initialState,
  action: UserActions
): UserState {
  const {type} = action
  switch (type) {
    case UserActionType.Update: {
      const {payload} = action as UserUpdateAction
      return {
        ...state,
        ...payload
      }
    }
    default:
      return state
  }
}