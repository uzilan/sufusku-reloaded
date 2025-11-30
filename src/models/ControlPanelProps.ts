export interface ControlPanelProps {
  onClearBoard: () => void
  onFreezeBoard: () => void
  onSolve: () => void
  selectedCell: [number, number] | null
}