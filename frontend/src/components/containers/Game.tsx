import React from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router'
import styled from 'styled-components'

import ChessBoard from '../ChessBoard'
import {colorSelector, gameStatusSelector, playersSelector} from '../../utils/reducers/game/gameSelectors'
import GameUserSection from '../GameUserSection'
import {PlayerColor} from '../../utils/PlayerColor'
import {GameStatus} from '../../utils/GameStatus'
import {routes} from '../../routes'

const GameContainer = styled.div`
  width:  66vmin;
  margin: auto;
`

const Game: React.FC = () => {
  const gameStatus = useSelector(gameStatusSelector)
  const history = useHistory()

  if (gameStatus === GameStatus.NotStarted) {
    history.push(routes.lobby)
    return null
  }

  return <ActiveGame/>
}

const ActiveGame: React.FC = () => {
  const {white, black} = useSelector(playersSelector)
  const yourColor = useSelector(colorSelector)!

  const opponentColor = yourColor === PlayerColor.White
    ? PlayerColor.Black
    : PlayerColor.White

  const you = yourColor === PlayerColor.White
    ? white!
    : black!

  const opponent = opponentColor === PlayerColor.White
    ? white!
    : black!

  return (
    <GameContainer>
      <GameUserSection user={opponent} color={opponentColor} isTop />
      <ChessBoard/>
      <GameUserSection user={you} color={yourColor}/>
    </GameContainer>
  )
}

export default Game