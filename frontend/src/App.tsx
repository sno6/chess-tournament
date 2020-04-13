import React from 'react'
import {StylesProvider} from '@material-ui/core/styles'
import {ThemeProvider} from 'styled-components'

import 'normalize.css/normalize.css'
import './App.css'
import Game from './components/containers/Game'
import theme from './theme'

const App: React.FC = () => (
  <StylesProvider injectFirst>
    <ThemeProvider theme={theme}>
      <div className="App">
        <Game/>
      </div>
    </ThemeProvider>
  </StylesProvider>
)


export default App
