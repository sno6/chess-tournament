import {Action} from 'redux'
import {UserState} from './userReducer'

export enum UserActionType {
  Update = 'user_update'
}

export interface UserUpdateAction extends Action {
  payload: Partial<UserState>;
}

export function userUpdate(
  payload: Partial<UserState>
): UserUpdateAction {
  return {
    type: UserActionType.Update,
    payload
  }
}

export type UserActions = UserUpdateAction