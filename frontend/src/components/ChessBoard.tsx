import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import {Piece, PieceType, Square} from 'chess.js'
import Box from '@material-ui/core/Box'

import BoardCell from './BoardCell'
import ChessService from '../utils/ChessService'
import getPositionFromEvent from '../utils/getPositionFromEvent'
import getSquareFromPosition from '../utils/getSquareFromPosition'
import {PlayerColor} from '../utils/PlayerColor'
import {colorSelector, fenSelector} from '../utils/reducers/game/gameSelectors'

const ChessContainer = styled.div`
  position: relative;
  width: 66vmin;
  height: 66vmin;
  display: flex;
  flex-direction: column;
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
  const [board, setBoard] = useState<Array<Array<{ type: PieceType; color: 'w' | 'b' } | null>>>([])

  const { chessInstance } = ChessService
  const color = useSelector(colorSelector)
  const fen = useSelector(fenSelector)
  const isInverted = color === PlayerColor.Black

  useEffect(() => {
    chessInstance.load(fen)
    setBoard([...chessInstance.board()])
  }, [fen])

  const onBoardClick = (evt: React.MouseEvent) => {
    if (chessInstance.game_over()) {
      // do nothing
      return
    }
    const position = getPositionFromEvent(evt.nativeEvent, isInverted)
    const square = getSquareFromPosition(position)
    const piece = chessInstance.get(square)

    if (selectedSquare) {
      if (selectedSquare === square) {
        // previously selected square clicked again, deselect it
        setSelectedSquare(null)
      } else {
        const selectedPiece = chessInstance.get(selectedSquare)
        if (piece && selectedPiece && piece.color === selectedPiece.color) {
          // different piece selected by the user
          setSelectedSquare(square)
        } else {
          // attempt to make the move
          const move = chessInstance.move({
            from: selectedSquare,
            to: square
          })
          if (!move) {
            console.info(`Invalid move: ${selectedSquare} -> ${square}`)
          } else {
            ChessService.sendMove() // TODO
            setSelectedSquare(null)
          }
        }
      }
    } else if (piece && piece.color === color) {
      // If a piece is on the clicked square and is the player's piece, select it
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
    ? chessInstance.moves({ square: selectedSquare, verbose: true })
      .map(move => move.to)
    : []

  const rows: Array<Array<{ cell: JSX.Element; index: number}>> = []

  board.forEach((row, i) => {
    const rowCells: Array<{ cell: JSX.Element; index: number}> = []
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

      const isLegal = legalMoves.includes(square)
      const pieceOnSquare = chessInstance.get(square)

      const isLegalMove = isLegal && !pieceOnSquare
      const isLegalCapture = isLegal && !!pieceOnSquare

      const isCheckmate = !!piece &&
        piece.type === chessInstance.KING &&
        piece.color === chessInstance.turn() &&
        chessInstance.in_checkmate()

      const isInCheck = !!piece &&
        piece.type === chessInstance.KING &&
        piece.color === chessInstance.turn() &&
        !isCheckmate &&
        chessInstance.in_check()

      const cell = <BoardCell
        key={index}
        piece={piece}
        isAlternate={isAlternate}
        isHovered={isHovered}
        isSelected={isSelected}
        isLegalMove={isLegalMove}
        isLegalCapture={isLegalCapture}
        isInCheck={isInCheck}
        isCheckmate={isCheckmate}
      />

      rowCells.push({ cell, index })
    })
    rows.push(rowCells)
    if (isInverted) {
      rowCells.reverse()
    }
  })

  if (isInverted) {
    rows.reverse()
  }

  return (
    <ChessContainer>
      {rows.map((row, index) => (
        <Box key={index} display="flex" flex={1}>
          { row.map(({ cell }) => cell) }
        </Box>
      ))}
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