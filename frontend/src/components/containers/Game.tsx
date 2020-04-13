import React from 'react'
import styled from 'styled-components'
import ChessBoard from '../ChessBoard'

const StyledText = styled.h1`
  color: ${({theme}) => theme.palette.primary.dark};
`

const Game: React.FC = () => {
  return (
    <>
      <StyledText>Chess</StyledText>
      <ChessBoard />
    </>
  )
}

export default Game