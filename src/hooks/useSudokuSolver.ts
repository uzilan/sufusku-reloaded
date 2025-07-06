import { useState } from 'react'

export const useSudokuSolver = (boardState: number[][]) => {
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const findCorrectValue = (row: number, col: number): number | null => {
    // First try the simple single candidate approach
    const availableNumbers = getAvailableNumbers(row, col)
    if (availableNumbers.size === 1) {
      return Array.from(availableNumbers)[0]
    }
    // If simple approach fails, try advanced solving techniques
    return findAdvancedSolution(row, col)
  }

  const findAdvancedSolution = (row: number, col: number): number | null => {
    // Try each available number and see if it leads to a valid solution
    const availableNumbers = getAvailableNumbers(row, col)
    for (const candidate of availableNumbers) {
      // Temporarily place the candidate
      const tempBoard = boardState.map(row => [...row])
      tempBoard[row][col] = candidate
      // Check if this placement creates any immediate conflicts
      if (!hasConflicts(tempBoard, row, col, candidate)) {
        // Check if this placement helps solve other cells uniquely
        if (isUniquelySolvable(tempBoard, row, col, candidate)) {
          return candidate
        }
      }
    }
    return null
  }

  const hasConflicts = (board: number[][], row: number, col: number, value: number): boolean => {
    // Check row for conflicts
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === value) {
        return true
      }
    }
    // Check column for conflicts
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === value) {
        return true
      }
    }
    // Check 3x3 box for conflicts
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && board[r][c] === value) {
          return true
        }
      }
    }
    return false
  }

  const isUniquelySolvable = (board: number[][], row: number, col: number, value: number): boolean => {
    // Check if placing this value creates any cells with only one possible number
    // This is a simplified version - in a full solver you'd do more complex analysis
    const affectedCells = getAffectedCells(row, col)
    for (const [r, c] of affectedCells) {
      if (board[r][c] === 0) { // Only check empty cells
        const available = getAvailableNumbersForBoard(board, r, c)
        if (available.size === 1) {
          return true // This placement creates a unique solution elsewhere
        }
      }
    }
    // Also check if this placement is the only valid option for this cell
    // by checking if any other number would create conflicts
    const otherCandidates = Array.from(getAvailableNumbers(row, col)).filter((n: number) => n !== value)
    let hasValidAlternative = false
    for (const candidate of otherCandidates) {
      if (!hasConflicts(board, row, col, candidate)) {
        hasValidAlternative = true
        break
      }
    }
    return !hasValidAlternative // Return true if this is the only valid option
  }

  const getAffectedCells = (row: number, col: number): [number, number][] => {
    const cells: [number, number][] = []
    // Add all cells in the same row
    for (let c = 0; c < 9; c++) {
      if (c !== col) {
        cells.push([row, c])
      }
    }
    // Add all cells in the same column
    for (let r = 0; r < 9; r++) {
      if (r !== row) {
        cells.push([r, col])
      }
    }
    // Add all cells in the same 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (r !== row && c !== col) {
          cells.push([r, c])
        }
      }
    }
    return cells
  }

  const getAvailableNumbersForBoard = (board: number[][], row: number, col: number): Set<number> => {
    const usedNumbers = new Set<number>()
    // Check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] !== 0) {
        usedNumbers.add(board[row][c])
      }
    }
    // Check column
    for (let r = 0; r < 9; r++) {
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
    // Return available numbers (1-9 minus used numbers)
    const allNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
    for (const used of usedNumbers) {
      allNumbers.delete(used)
    }
    return allNumbers
  }

  const getAvailableNumbers = (row: number, col: number): Set<number> => {
    return getAvailableNumbersForBoard(boardState, row, col)
  }

  const showAlert = (message: string) => {
    setAlertMessage(message)
    setAlertVisible(true)
  }

  const hideAlert = () => {
    setAlertVisible(false)
  }

  return {
    findCorrectValue,
    showAlert,
    hideAlert,
    alertVisible,
    alertMessage
  }
} 