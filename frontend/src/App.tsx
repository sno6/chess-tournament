import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {StylesProvider} from '@material-ui/core/styles'
import {ThemeProvider} from 'styled-components'

import 'normalize.css/normalize.css'
import './App.css'

import Game from './components/containers/Game'
import theme from './theme'
import Lobby from './components/containers/Lobby'
import ChessService from './utils/ChessService'

const routes = {
  lobby: '/',
  game: '/game'
}

const App: React.FC = () => {
  useEffect(() => {
    ChessService.connect()
  }, [])

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path={routes.lobby} exact component={Lobby}/>
            <Route path={routes.game} component={Game}/>
          </Switch>
        </Router>
      </ThemeProvider>
    </StylesProvider>
  )
}


export default App
