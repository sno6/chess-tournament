import React, {useEffect, useMemo, useState} from 'react'
import styled from 'styled-components'
import Chess, {Square} from 'chess.js'

import BoardCell from './BoardCell'
import ChessService from '../utils/ChessService'
import getPositionFromEvent from '../utils/getPositionFromEvent'
import getSquareFromPosition from '../utils/getSquareFromPosition'

const ChessContainer = styled.div`
  position: relative;
  width: 66vmin;
  height: 66vmin;
  display: flex;
  flex-wrap: wrap;
  margin: auto;
  border: 16px solid #aaa;
`

const EventsOverlay = React.memo(styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 2;
  cursor: pointer;
`)

const ChessBoard: React.FC = () => {
  const [selectedSquare, setSelectedSquare] = useState<null | Square>(null)
  const [hoverPosition, setHoverPosition] = useState<null | number[]>(null)

  const chess = useMemo(() => new Chess(), [])
  const player: any = chess.BLACK
  const isInverted = player === chess.BLACK

  useEffect(() => {
    console.log(chess)
    ChessService.connect()

    setTimeout(() => {
      if (ChessService.isConnected()) {
        ChessService.send(2, {name: 'David'})
      }
    }, 5000)
  }, [])

  const onBoardClick = (evt: React.MouseEvent) => {
    if (chess.game_over()) {
      // do nothing
      return
    }
    const position = getPositionFromEvent(evt.nativeEvent, isInverted)
    const square = getSquareFromPosition(position)
    const piece = chess.get(square)

    if (selectedSquare) {
      if (selectedSquare === square) {
        // previously selected square clicked again, deselect it
        setSelectedSquare(null)
      } else {
        const selectedPiece = chess.get(selectedSquare)
        if (piece && selectedPiece && piece.color === selectedPiece.color) {
          // different piece selected by the user
          setSelectedSquare(square)
        } else {
          // attempt to make the move
          const move = chess.move({
            from: selectedSquare,
            to: square
          })
          if (!move) {
            console.info(`Invalid move: ${selectedSquare} -> ${square}`)
          } else {
            ChessService.sendMove('') // TODO
            setSelectedSquare(null)
          }
        }
      }
    } else if (piece && piece.color === chess.turn()) {
      // If a piece is on the clicked square and is the same color as whose turn it is, select it
      setSelectedSquare(square)
    }
  }

  const onBoardMouseMove = (evt: React.MouseEvent) => {
    const position = getPositionFromEvent(evt.nativeEvent, isInverted)
    setHoverPosition(position)
  }

  const onBoardMouseOut = () => {
    setHoverPosition(null)
  }

  const legalMoves = selectedSquare
    ? chess.moves({ square: selectedSquare, verbose: true })
      .map(move => move.to)
    : []

  // TODO optimise by making board component state, only updating it when a move is made
  const board = chess.board()
  const cells: Array<{ cell: JSX.Element; index: number}> = []

  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      const rank = 8 - i
      const file = j + 1
      const square = getSquareFromPosition([rank, file])

      const index = i * 8 + j
      const isAlternate = index % 2 === (rank % 2)

      const isHovered = !!hoverPosition &&
        hoverPosition[0] === rank &&
        hoverPosition[1] === file

      const isSelected = !!selectedSquare &&
        selectedSquare === getSquareFromPosition([rank, file])

      const isLegalMove = legalMoves.includes(square)

      const isCheckmate = !!piece &&
        piece.type === chess.KING &&
        piece.color === chess.turn() &&
        chess.in_checkmate()

      const isInCheck = !!piece &&
        piece.type === chess.KING &&
        piece.color === chess.turn() &&
        !isCheckmate &&
        chess.in_check()

      const cell = <BoardCell
        piece={piece}
        isAlternate={isAlternate}
        isHovered={isHovered}
        isSelected={isSelected}
        isLegalMove={isLegalMove}
        isInCheck={isInCheck}
        isCheckmate={isCheckmate}
      />

      cells.push({ cell, index })
    })
  })

  if (isInverted) {
    cells.reverse()
  }

  return (
    <ChessContainer>
      {cells.map(({ cell }) => cell)}
      <EventsOverlay
        onClick={onBoardClick}
        onMouseOver={onBoardMouseMove}
        onMouseMove={onBoardMouseMove}
        onMouseOut={onBoardMouseOut}
      />
    </ChessContainer>
  )
}

export default ChessBoard