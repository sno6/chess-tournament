import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {ThemeProvider} from 'styled-components'
import {StylesProvider} from '@material-ui/core/styles'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import {store} from './utils/store'
import theme from './theme'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App/>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
