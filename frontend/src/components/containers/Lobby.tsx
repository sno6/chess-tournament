import React, {ChangeEvent, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router'
import styled, {css} from 'styled-components'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import ChessService from '../../utils/ChessService'
import {gameStatusSelector} from '../../utils/reducers/game/gameSelectors'
import {GameStatus} from '../../utils/GameStatus'
import {routes} from '../../routes'
import {registeredUsersSelector} from '../../utils/reducers/lobby/lobbySelectors'
import RegisteredUsers from '../RegisteredUsers'

const UsernameForm = styled.div(({theme}) => css`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-top: ${theme.spacing(4)}px;
  
  .MuiTextField-root {
    flex: 1;
  }
`
)

const EnterButton = styled(Button).attrs({
  color: 'primary',
  variant: 'contained'
})(({theme}) => css`
  margin-left: ${theme.spacing(4)}px;
`
)

const Lobby: React.FC = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [isEntered, setIsEntered] = useState(false)

  const gameStatus = useSelector(gameStatusSelector)
  const registeredUsers = useSelector(registeredUsersSelector)
  const history = useHistory()

  const onUsernameChange =
    (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)

  const onEnter = () => {
    localStorage.setItem('username', username)
    if (ChessService.isConnected) {
      ChessService.registerUser(username)
      setIsEntered(true)
    } else {
      // TODO: reconnect logic
      window.alert('Backend chess service not connected')
    }
  }

  useEffect(() => {
    if (gameStatus === GameStatus.Ready) {
      history.push(routes.game)
    }
  }, [gameStatus])

  return (
    <>
      <Typography variant="h2" gutterBottom>Chess Tournament</Typography>
      {
        isEntered && (
          <>
            <Typography variant="body1">
              Waiting for enough users for the tournament to start...
            </Typography>
            <Box mt={3}>
              <RegisteredUsers users={registeredUsers}/>
            </Box>
          </>
        )
      }
      {
        !isEntered && (
          <Card>
            <CardContent>
              <Typography variant="body1">
                Welcome! Please enter your username:
              </Typography>
              <UsernameForm>
                <TextField
                  label="Username"
                  defaultValue={username}
                  onChange={onUsernameChange}
                />
                <EnterButton disabled={!username} onClick={onEnter}>
                  Enter
                </EnterButton>
              </UsernameForm>
            </CardContent>
          </Card>
        )
      }
    </>
  )
}

export default Lobby
