export default function stringToColour(str: string) {
  const values = str.split('').map(char => char.charCodeAt(0))
  const product = values.reduce((acc, value) => acc * value, 1)
  return `hsl(${product % 256}, 70%, 80%)`
}