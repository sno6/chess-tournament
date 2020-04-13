import React from 'react'
import {Piece} from 'chess.js'
import styled from 'styled-components'

const StyledImg = styled.img`
  width: 90%;
`

interface ChessPieceProps {
  piece: Piece;
}

const ChessPiece: React.FC<ChessPieceProps> = ({piece}) => {
  const src = `/img/${piece.color}${piece.type}.png`
  return <StyledImg src={src}/>
}

export default React.memo(ChessPiece)