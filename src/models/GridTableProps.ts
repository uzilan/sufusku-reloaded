export interface GridTableProps {
  size?: number
  onCellClick?: (rowIndex: number, colIndex: number) => void
  onValueChange?: (rowIndex: number, colIndex: number, value: number) => void
  board: number[][]
  frozenCells: Set<string>
  selectedCell: [number, number] | null
} 