export interface BoardManagerProps {
  board: number[][]
  frozenCells: Set<string>
  selectedCell: [number, number] | null
  onCellChange: (row: number, col: number, value: number) => void
  onCellClick: (row: number, col: number) => void
} 