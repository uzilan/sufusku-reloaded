import React, { useMemo } from 'react'
import GridCell from './GridCell'
import { GridTableProps } from '../models'

const GridTable: React.FC<GridTableProps> = ({ 
  size = 9, 
  onCellClick,
  onValueChange,
  board,
  frozenCells,
  selectedCell
}) => {
  // Function to get available numbers for a cell
  const getAvailableNumbers = (rowIndex: number, colIndex: number): Set<number> => {
    // If the cell is already filled, return empty set
    if (board[rowIndex][colIndex] !== 0) {
      return new Set()
    }
    
    const usedNumbers = new Set<number>()
    
    // Check row
    for (let col = 0; col < size; col++) {
      if (board[rowIndex][col] !== 0) {
        usedNumbers.add(board[rowIndex][col])
      }
    }
    
    // Check column
    for (let row = 0; row < size; row++) {
      if (board[row][colIndex] !== 0) {
        usedNumbers.add(board[row][colIndex])
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(rowIndex / 3) * 3
    const boxCol = Math.floor(colIndex / 3) * 3
    for (let row = boxRow; row < boxRow + 3; row++) {
      for (let col = boxCol; col < boxCol + 3; col++) {
        if (board[row][col] !== 0) {
          usedNumbers.add(board[row][col])
        }
      }
    }
    
    // Return available numbers (1-9 minus used numbers)
    const allNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
    for (const used of usedNumbers) {
      allNumbers.delete(used)
    }
    
    return allNumbers
  }

  // Function to check if a cell has duplicates in its row, column, or 3x3 box
  const getDuplicateCells = useMemo(() => {
    const duplicates = new Set<string>()
    
    // Check rows for duplicates
    for (let row = 0; row < size; row++) {
      const rowNumbers = new Map<number, number[]>()
      for (let col = 0; col < size; col++) {
        const value = board[row][col]
        if (value !== 0) {
          if (!rowNumbers.has(value)) {
            rowNumbers.set(value, [])
          }
          rowNumbers.get(value)!.push(col)
        }
      }
      
      // Mark cells with duplicates
      rowNumbers.forEach((cols, _value) => {
        if (cols.length > 1) {
          cols.forEach(col => {
            duplicates.add(`${row}-${col}`)
          })
        }
      })
    }
    
    // Check columns for duplicates
    for (let col = 0; col < size; col++) {
      const colNumbers = new Map<number, number[]>()
      for (let row = 0; row < size; row++) {
        const value = board[row][col]
        if (value !== 0) {
          if (!colNumbers.has(value)) {
            colNumbers.set(value, [])
          }
          colNumbers.get(value)!.push(row)
        }
      }
      
      // Mark cells with duplicates
      colNumbers.forEach((rows, _value) => {
        if (rows.length > 1) {
          rows.forEach(row => {
            duplicates.add(`${row}-${col}`)
          })
        }
      })
    }
    
    // Check 3x3 boxes for duplicates
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const boxNumbers = new Map<number, string[]>()
        
        // Check each cell in the 3x3 box
        for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
          for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
            const value = board[row][col]
            if (value !== 0) {
              if (!boxNumbers.has(value)) {
                boxNumbers.set(value, [])
              }
              boxNumbers.get(value)!.push(`${row}-${col}`)
            }
          }
        }
        
        // Mark cells with duplicates in the box
        boxNumbers.forEach((cells, _value) => {
          if (cells.length > 1) {
            cells.forEach(cell => {
              duplicates.add(cell)
            })
          }
        })
      }
    }
    
    return duplicates
  }, [board, size])

  // Function to check if a cell has only one available number
  const getSingleOptionCells = useMemo(() => {
    const singleOptions = new Set<string>()
    
    console.log('Current board state:')
    board.forEach((row, rowIndex) => {
      console.log(`Row ${rowIndex}:`, row)
    })
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        // Only check empty cells
        if (board[row][col] === 0) {
          // Calculate available numbers directly here to ensure we use current board state
          const usedNumbers = new Set<number>()
          
          // Check row
          for (let c = 0; c < size; c++) {
            if (board[row][c] !== 0) {
              usedNumbers.add(board[row][c])
            }
          }
          
          // Check column
          for (let r = 0; r < size; r++) {
            if (board[r][col] !== 0) {
              usedNumbers.add(board[r][col])
            }
          }
          
          // Check 3x3 box
          const boxRow = Math.floor(row / 3) * 3
          const boxCol = Math.floor(col / 3) * 3
          for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
              if (board[r][c] !== 0) {
                usedNumbers.add(board[r][c])
              }
            }
          }
          
          // Calculate available numbers
          const allNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
          for (const used of usedNumbers) {
            allNumbers.delete(used)
          }
          
          if (allNumbers.size === 1) {
            singleOptions.add(`${row}-${col}`)
            console.log(`Single option cell: (${row},${col}) with value ${Array.from(allNumbers)[0]}`)
          }
        } else {
          console.log(`Cell (${row},${col}) is filled with value ${board[row][col]}`)
        }
      }
    }
    
    console.log('Single option cells:', Array.from(singleOptions))
    return singleOptions
  }, [board, size])

  const handleValueChange = (rowIndex: number, colIndex: number, value: number) => {
    if (onValueChange) {
      onValueChange(rowIndex, colIndex, value)
    }
  }

  // Generate column headers A to I
  const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']

  return (
    <div className="sudoku-board">
      <div className="sudoku-grid">
        {/* Top-left empty header */}
        <div className="sudoku-header sudoku-header-corner" />
        {/* Column headers */}
        {columnHeaders.map((header) => (
          <div key={`col-${header}`} className="sudoku-header sudoku-header-col">{header}</div>
        ))}

        {/* Rows with row header + 9 cells */}
        {board.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            <div className="sudoku-header sudoku-header-row">{rowIndex + 1}</div>
            {row.map((cellValue, colIndex) => {
              const availableNumbers = getAvailableNumbers(rowIndex, colIndex)
              return (
                <GridCell
                  key={`${rowIndex}-${colIndex}`}
                  value={cellValue}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  onValueChange={handleValueChange}
                  onCellClick={onCellClick}
                  isFrozen={frozenCells.has(`${rowIndex}-${colIndex}`)}
                  isDuplicate={getDuplicateCells.has(`${rowIndex}-${colIndex}`)}
                  isSingleOption={getSingleOptionCells.has(`${rowIndex}-${colIndex}`)}
                  isSelected={!!(selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex)}
                  availableNumbers={availableNumbers}
                  selectedCell={selectedCell}
                />
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default GridTable 