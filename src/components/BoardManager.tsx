import { forwardRef, useImperativeHandle } from 'react'
import GridTable from './GridTable'
import { BoardManagerProps, BoardManagerRef } from '../models'

const BoardManager = forwardRef<BoardManagerRef, BoardManagerProps>(({
  board,
  frozenCells,
  selectedCell,
  onCellChange,
  onCellClick
}, ref) => {
  // Expose getBoard through ref
  useImperativeHandle(ref, () => ({
    getBoard: () => board
  }))

  const handleValueChange = (rowIndex: number, colIndex: number, value: number) => {
    onCellChange(rowIndex, colIndex, value)
  }

  return (
    <div className="grid-container">
      <GridTable 
        size={9} 
        onCellClick={onCellClick}
        onValueChange={handleValueChange}
        board={board}
        frozenCells={frozenCells}
        selectedCell={selectedCell}
      />
    </div>
  )
})

BoardManager.displayName = 'BoardManager'

export default BoardManager 