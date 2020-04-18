import React from 'react'
import styled from 'styled-components'
import {Piece} from 'chess.js'

import ChessPiece from './ChessPiece'

interface BoardCellProps {
  piece: Piece | null;
  isAlternate: boolean;
  isSelected: boolean;
  isHovered: boolean;
  isLegalMove: boolean;
  isInCheck: boolean;
  isCheckmate: boolean;
}

const StyledDiv = styled.div`
  position: relative;
  width: 12.5%;
  height: 12.5%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.alternate {
    background-color: #b7cee2
  }
  
  &.legal-move::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 1;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    background-color: #82c5a0;
  }
  
  &.in-check {
    background-color: #ffd891;
  }
  
  &.checkmate {
    background-color: #ff9191;
  }
  
  &.hover {
    background-color: #6f8da7;
  }
  
  &.selected {
    background-color: #82c5a0;
  }
  
  & img {
    z-index: 2;
  }
`


const BoardCell: React.FC<BoardCellProps> = ({
  piece,
  isAlternate,
  isSelected,
  isHovered,
  isLegalMove,
  isInCheck,
  isCheckmate,
}) => {
  const className = [
    isAlternate ? 'alternate' : '',
    isHovered ? 'hover' : '',
    isSelected ? 'selected' : '',
    isLegalMove ? 'legal-move' : '',
    isInCheck ? 'in-check' : '',
    isCheckmate ? 'checkmate' : ''
  ].join(' ').trim()

  return (
    <StyledDiv className={className}>
      {piece && <ChessPiece piece={piece} />}
    </StyledDiv>
  )
}

export default React.memo(BoardCell)