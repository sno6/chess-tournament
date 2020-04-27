import { Action } from 'redux'
import Chess, {ChessInstance} from 'chess.js'

import {ReceiveEvent} from './ReceiveEvent'
import {SendEvent} from './SendEvent'
import {lobbyUpdate} from './reducers/lobby/lobbyActions'
import {gameStarted, gameUpdated} from './reducers/game/gameActions'
import {userUpdate} from './reducers/user/userActions'

interface ReceivedMessage {
  action: ReceiveEvent;
  payload: any;
}

class ChessService {
  private ws: WebSocket | null = null
  private _isConnected = false
  private _chessJsInstance = new Chess()
  private _dispatch!: (action: Action) => any

  get chessInstance(): ChessInstance {
    return this._chessJsInstance
  }

  get isConnected(): boolean {
    return this._isConnected
  }

  set dispatch(dispatcher: (action: Action) => any) {
    // TODO: change this to user redux middleware instead
    this._dispatch = dispatcher
  }

  connect() {
    if (!this._dispatch) {
      console.error('Missing action dispatcher')
      return
    }
    const wsUrl = process.env.REACT_APP_WS_URL
    if (!wsUrl) {
      console.error('Missing Websocket url')
      return
    }

    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      this._isConnected = true
      console.info('Websocket open')
    }

    this.ws.onclose = () => {
      this._isConnected = false
      console.info('Websocket closed')
    }

    this.ws.onmessage = message => {
      this.onMessageReceived(message.data)
    }

    this.ws.onerror = error => {
      console.error('Websocket error:', error)
    }
  }

  private onMessageReceived(message: string) {
    console.info('Websocket message received:', message)
    try {
      const data: ReceivedMessage = JSON.parse(message)
      const { action, payload } = data
      switch (action) {
        case ReceiveEvent.LobbyUpdate:
          console.info('Lobby update:', payload)
          this._dispatch(lobbyUpdate(payload))
          break
        case ReceiveEvent.BoardState:
          console.info('Update game state:', payload)
          this._dispatch(gameUpdated(payload))
          break
        case ReceiveEvent.InvalidMove:
          console.error('Invalid move sent:', payload)
          break
        case ReceiveEvent.MatchStarted:
          console.info('Match started:', payload)
          this._dispatch(gameStarted(payload))
          break
        case ReceiveEvent.MatchOutcome:
          console.info('Match outcome:', payload)
          // TODO
          break
        case ReceiveEvent.TournamentStarted:
          console.info('Tournament started:', payload)
          // TODO
          break
        case ReceiveEvent.TournamentOutcome:
          console.info('Tournament outcome:', payload)
          // TODO
          break
        default:
          console.warn('Unknown event: ', data)
      }
      console.info('Parsed data: ', data)
    } catch (e) {
      console.error('Unable to parse message: ', message)
    }
  }

  private send(action: SendEvent, payload?: object) {
    if (this.ws) {
      this.ws.send(JSON.stringify({action, payload}))
    }
  }

  registerUser(name: string) {
    this.send(SendEvent.UserRegister, { name })
    // TODO: ask for BE to add registration success
    this._dispatch(userUpdate({ name, isRegistered: true }))
  }

  sendMove() {
    const history = this.chessInstance.history()
    const move = history[history.length - 1]
    console.log('sending move:', move)
    this.send(SendEvent.UserMoved, { move })
  }

  resign() {
    this.send(SendEvent.UserResigned)
  }

  offerDraw() {
    this.send(SendEvent.UserOfferedDraw)
  }

  acceptDraw() {
    this.send(SendEvent.UserAcceptedDraw)
  }

  declineDraw() {
    this.send(SendEvent.UserDeclinedDraw)
  }

}

export default new ChessService()
