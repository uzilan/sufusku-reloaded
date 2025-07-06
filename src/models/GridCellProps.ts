export interface GridCellProps {
  value: number
  rowIndex: number
  colIndex: number
  onCellClick?: (rowIndex: number, colIndex: number) => void
  onValueChange?: (rowIndex: number, colIndex: number, value: number) => void
  isFrozen: boolean
  isDuplicate: boolean
  isSingleOption: boolean
  isSelected: boolean
  availableNumbers: Set<number>
  selectedCell: [number, number] | null
} 