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
  isLegalCapture: boolean;
  isInCheck: boolean;
  isCheckmate: boolean;
}

const StyledDiv = styled.div`
  flex: 1;
  position: relative;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.alternate {
    background-color: #b7cee2;
  }
  
  &.legal-move::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 1;
    width: 40%;
    height: 40%;
    border-radius: 50%;
    background-color: rgba(130, 197, 160, 0.6);
  }
  
  &.legal-capture::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    background: radial-gradient(circle at center, transparent 72%, rgba(130, 197, 160, 0.6) 72.5%) 50% 50%;
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
  isLegalCapture,
  isInCheck,
  isCheckmate
}) => {
  const className = [
    isAlternate ? 'alternate' : '',
    isHovered ? 'hover' : '',
    isSelected ? 'selected' : '',
    isLegalMove ? 'legal-move' : '',
    isLegalCapture ? 'legal-capture' : '',
    isInCheck ? 'in-check' : '',
    isCheckmate ? 'checkmate' : ''
  ].join(' ').trim()

  return (
    <StyledDiv className={className}>
      {piece && <ChessPiece piece={piece}/>}
    </StyledDiv>
  )
}

export default React.memo(BoardCell)