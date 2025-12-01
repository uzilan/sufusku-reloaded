import React, { useState, useEffect, useRef } from 'react'
import { GridCellProps } from '../models'

const GridCell: React.FC<GridCellProps> = ({ 
  value, 
  rowIndex, 
  colIndex, 
  onCellClick,
  onValueChange,
  isFrozen,
  isDuplicate,
  isSingleOption,
  isSelected,
  availableNumbers,
  selectedCell
}) => {
  const [inputValue, setInputValue] = useState(value === 0 ? '' : value.toString())
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInputWithoutScroll = () => {
    const y = window.scrollY
    try {
      inputRef.current?.focus({ preventScroll: true } as any)
    } catch (_e) {
      inputRef.current?.focus()
    }
    if (window.scrollY !== y) {
      setTimeout(() => window.scrollTo(0, y), 0)
    }
  }

  // Update inputValue when value prop changes (e.g., when grid is reset)
  useEffect(() => {
    setInputValue(value === 0 ? '' : value.toString())
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Don't allow changes if frozen
    if (isFrozen) {
      return
    }
    
    const newValue = e.target.value
    
    // Only allow single digits 1-9 or empty
    if (newValue === '' || (/^[1-9]$/.test(newValue))) {
      setInputValue(newValue)
      const numValue = newValue === '' ? 0 : parseInt(newValue, 10)
      if (onValueChange) {
        onValueChange(rowIndex, colIndex, numValue)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow key navigation (even for frozen cells)
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault()
      
      // Find the next non-frozen cell in the direction of navigation
      let nextRow = rowIndex
      let nextCol = colIndex
      
      switch (e.key) {
        case 'ArrowLeft':
          nextCol = colIndex - 1
          break
        case 'ArrowRight':
          nextCol = colIndex + 1
          break
        case 'ArrowUp':
          nextRow = rowIndex - 1
          break
        case 'ArrowDown':
          nextRow = rowIndex + 1
          break
      }
      
      // Find the next non-frozen cell
      const findNextNonFrozenCell = (startRow: number, startCol: number, direction: string): [number, number] | null => {
        let currentRow = startRow
        let currentCol = startCol
        
        // Keep moving in the direction until we find a non-frozen cell or hit the boundary
        while (currentRow >= 0 && currentRow < 9 && currentCol >= 0 && currentCol < 9) {
          // Check if this cell is frozen by looking for its input element and checking if it's readOnly
          const allInputs = document.querySelectorAll('.data-cell input')
          const cellIndex = currentRow * 9 + currentCol
          const cellInput = allInputs[cellIndex] as HTMLInputElement
          
          if (cellInput && !cellInput.readOnly) {
            return [currentRow, currentCol]
          }
          
          // Move to next cell in direction
          switch (direction) {
            case 'ArrowLeft':
              currentCol--
              break
            case 'ArrowRight':
              currentCol++
              break
            case 'ArrowUp':
              currentRow--
              break
            case 'ArrowDown':
              currentRow++
              break
          }
        }
        
        return null
      }
      
      const nextCell = findNextNonFrozenCell(nextRow, nextCol, e.key)
      if (nextCell) {
        const [targetRow, targetCol] = nextCell
        const allInputs = document.querySelectorAll('.data-cell input')
        const targetIndex = targetRow * 9 + targetCol
        const targetInput = allInputs[targetIndex] as HTMLInputElement
        if (targetInput) {
          try {
            (targetInput as HTMLInputElement).focus({ preventScroll: true } as any)
          } catch (_e) {
            (targetInput as HTMLInputElement).focus()
          }
        }
      }
      
      return
    }
    
    // Don't allow input if frozen
    if (isFrozen) {
      e.preventDefault()
      return
    }
    
    // Prevent non-numeric keys except backspace, delete, tab, escape, enter
    if (!/[1-9]/.test(e.key) && 
        !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
      e.preventDefault()
    }
  }

  // click is handled inline on the outer div

  const handleFocus = () => {
    if (onCellClick) {
      onCellClick(rowIndex, colIndex)
    }
  }

  // Generate label showing available numbers or the selected number
  const generateLabel = (): string => {
    if (inputValue !== '') {
      // If cell has a value, show empty label
      return ''
    }
    
    // If cell is empty, show available numbers
    if (availableNumbers.size === 0) {
      return '123456789'
    }
    
    // Convert available numbers to sorted string
    return Array.from(availableNumbers).sort().join('')
  }

  // Check if this cell is in the selected row or column (but not the selected cell itself)
  const isInSelectedRowOrCol = selectedCell && (
    (selectedCell[0] === rowIndex || selectedCell[1] === colIndex) &&
    !(selectedCell[0] === rowIndex && selectedCell[1] === colIndex)
  )

  const getCellClasses = (): string => {
    const classes = ['data-cell']
    
    if (isFrozen) classes.push('frozen-cell')
    if (isDuplicate) classes.push('error-cell')
    if (isSingleOption) classes.push('single-option-cell')
    if (isSelected) classes.push('selected-cell')
    if (isInSelectedRowOrCol) classes.push('selected-rowcol')
    
    return classes.join(' ')
  }

  // Inline border styling to recreate Sudoku thick borders in CSS Grid
  const getBorderStyle = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: 'relative',
      padding: 0,
      cursor: isFrozen ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s',
      border: '1px solid #dee2e6'
    }
    // Thick border after each 3rd column
    if ((colIndex + 1) % 3 === 0 && colIndex !== 8) {
      styles.borderRight = '3px solid #333'
    }
    // Thick border after each 3rd row
    if ((rowIndex + 1) % 3 === 0 && rowIndex !== 8) {
      styles.borderBottom = '3px solid #333'
    }
    // Outer borders
    if (colIndex === 0) styles.borderLeft = '3px solid #333'
    if (rowIndex === 0) styles.borderTop = '3px solid #333'
    if (colIndex === 8) styles.borderRight = '3px solid #333'
    if (rowIndex === 8) styles.borderBottom = '3px solid #333'
    return styles
  }

  return (
    <div
      className={getCellClasses()}
      style={getBorderStyle()}
      onTouchStart={(e) => {
        if (isFrozen) return
        e.preventDefault()
        if (onCellClick) onCellClick(rowIndex, colIndex)
        focusInputWithoutScroll()
      }}
      onMouseDown={(e) => {
        if (isFrozen) return
        e.preventDefault()
        if (onCellClick) onCellClick(rowIndex, colIndex)
        focusInputWithoutScroll()
      }}
      onClick={() => {
        if (onCellClick && !isFrozen) {
          onCellClick(rowIndex, colIndex)
        }
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          readOnly={isFrozen}
          style={{
            width: '100%',
            flex: '1',
            border: 'none',
            textAlign: 'center',
            outline: 'none',
            background: 'transparent',
            marginBottom: inputValue === '' ? '2px' : '0',
            color: '#000000',
            fontWeight: 'bold',
            cursor: isFrozen ? 'not-allowed' : 'text',
            // Mobile-friendly improvements
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            borderRadius: '0',
            // Prevent zoom on iOS
            fontSize: '16px',
            // Better touch targets
            minHeight: '30px'
          }}
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        {inputValue === '' && (
          <div style={{
            fontSize: '10px',
            color: '#666',
            textAlign: 'center',
            lineHeight: '1',
            wordBreak: 'break-all',
            flexShrink: '0'
          }}>
            {generateLabel()}
          </div>
        )}
      </div>
    </div>
  )
}

export default GridCell