export default function getPositionFromEvent(
  event: MouseEvent,
  isInverted: boolean
): number[] {
  const { offsetX, offsetY } = event
  const { offsetWidth, offsetHeight } = event.target as HTMLElement

  const x = offsetX / offsetWidth
  const y = offsetY / offsetHeight

  const r = Math.ceil((1 - y) * 8)
  const f = Math.ceil(x * 8)

  const rank = isInverted ? 9 - r : r
  const file = isInverted ? 9 - f: f

  return [rank, file]
}