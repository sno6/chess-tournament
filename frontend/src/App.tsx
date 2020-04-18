import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {useDispatch} from 'react-redux'

import 'normalize.css/normalize.css'
import './App.css'

import Game from './components/containers/Game'
import Lobby from './components/containers/Lobby'
import ChessService from './utils/ChessService'

const routes = {
  lobby: '/',
  game: '/game'
}

const App: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    ChessService.dispatch = dispatch
    ChessService.connect()
  }, [dispatch])

  return (
    <Router>
      <Switch>
        <Route path={routes.lobby} exact component={Lobby}/>
        <Route path={routes.game} component={Game}/>
      </Switch>
    </Router>
  )
}


export default App
