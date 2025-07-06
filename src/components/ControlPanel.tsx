import React from 'react'
import { CButton } from '@coreui/react'
import { ControlPanelProps } from '../models'

const ControlPanel: React.FC<ControlPanelProps> = ({
  onClearBoard,
  onFreezeBoard,
  onSolve,
  selectedCell
}) => {
  console.log('ControlPanel render - selectedCell:', selectedCell)
  
  // Convert selectedCell coordinates to letter-number format for display
  const getSelectedCellDisplay = (): string => {
    if (!selectedCell) return ''
    const [row, col] = selectedCell
    const colLetter = String.fromCharCode(65 + col) // A=0, B=1, etc.
    const rowNumber = row + 1 // 1-based row numbers
    return `${colLetter}${rowNumber}`
  }
  
  return (
    <div className="control-panel">
      <CButton 
        color="warning" 
        onClick={onClearBoard}
        className="control-button"
      >
        Clear Board
      </CButton>
      <CButton 
        color="primary" 
        onClick={onFreezeBoard}
        className="control-button"
      >
        Freeze Board
      </CButton>
      <CButton 
        color="info" 
        onClick={(e) => {
          e.stopPropagation() // Prevent event bubbling
          onSolve()
        }}
        className="control-button solve-button"
        disabled={!selectedCell}
      >
        {selectedCell ? `Solve ${getSelectedCellDisplay()}` : 'Solve ...'}
      </CButton>
    </div>
  )
}

export default ControlPanel 