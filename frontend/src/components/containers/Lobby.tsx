import React, {ChangeEvent, useState} from 'react'
import {Button, TextField, Typography} from '@material-ui/core'
import styled, {css} from 'styled-components'
import ChessService from '../../utils/ChessService'

const UsernameForm = styled.div(({ theme}) => css`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-top: ${theme.spacing(4)}px;
`
)

const EnterButton = styled(Button).attrs({
  color: 'primary',
  variant: 'contained'
})(({ theme }) => css`
  margin-left: ${theme.spacing(4)}px;
`
)

const Lobby: React.FC = () => {
  const [waitingForTotal, setWaitingForTotal] = useState(0)
  const [username, setUsername] = useState(localStorage.getItem('username') || '')
  const [isEntered, setIsEntered] = useState(false)

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

  return (
    <>
      <Typography variant="h2" gutterBottom>Chess Tournament</Typography>
      <Typography variant="body1">
        {
          isEntered
            ? `Waiting for ${waitingForTotal} players...`
            : 'Welcome! Please enter your username:'
        }
      </Typography>
      {
        !isEntered && (
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
        )
      }
    </>
  )
}

export default Lobby
