import Chess, {ChessInstance} from 'chess.js'
import GameAction from './GameAction'

class ChessService {
  private ws: WebSocket | null = null
  private _isConnected = false
  private _chessJsInstance = new Chess()

  get chessInstance(): ChessInstance {
    return this._chessJsInstance
  }

  get isConnected(): boolean {
    return this._isConnected
  }

  connect() {
    const wsUrl = process.env.REACT_APP_WS_URL
    if (!wsUrl) {
      console.error('Missing Websocket url')
    }

    this.ws = new WebSocket(wsUrl!)

    this.ws.onopen = () => {
      this._isConnected = true
      console.info('Websocket open')
    }

    this.ws.onclose = () => {
      this._isConnected = false
      console.info('Websocket closed')
    }

    this.ws.onmessage = message => {
      console.info('Websocket message received:', message)
    }

    this.ws.onerror = error => {
      console.error('Websocket error:', error)
    }
  }

  send(action: GameAction, payload?: object) {
    if (this.ws) {
      this.ws.send(JSON.stringify({action, payload}))
    }
  }

  registerUser(name: string) {
    this.send(GameAction.UserRegister, { name })
  }

  sendMove(move: string) {
    this.send(GameAction.UserMoved, { move })
  }

  resign() {
    this.send(GameAction.UserResigned)
  }

  offerDraw() {
    this.send(GameAction.UserOfferedDraw)
  }

  acceptDraw() {
    // TODO
  }

  declineDraw() {
    // TODO
  }

}

export default new ChessService()
