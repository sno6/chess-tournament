import {Square} from 'chess.js'

export default function getSquareFromPosition(position: number[]): Square {
  const file = String.fromCharCode(96 + position[1])
  const rank = position[0]
  return `${file}${rank}` as Square
}