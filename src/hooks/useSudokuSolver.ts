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
      // Hidden single in any unit (row/col/box) — decide without guessing
      if (isHiddenSingle(boardState, row, col, candidate)) {
        return candidate
      }

      // Check for immediate conflicts on the current board
      if (!hasConflicts(boardState, row, col, candidate)) {
        // Evaluate whether placing this value either forces progress
        // or is the only valid choice for this cell.
        if (isUniquelySolvable(boardState, row, col, candidate)) {
          return candidate
        }
      }
    }
    return null
  }

  // Checks whether a candidate is a hidden single in the row, column, or 3x3 box
  const isHiddenSingle = (board: number[][], row: number, col: number, value: number): boolean => {
    // Row check: is `value` the only candidate among all empty cells in this row?
    let occurrences = 0
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === 0) {
        const candidates = getAvailableNumbersForBoard(board, row, c)
        if (candidates.has(value)) occurrences++
        if (occurrences > 1) break
      }
    }
    if (occurrences === 1) return true

    // Column check
    occurrences = 0
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === 0) {
        const candidates = getAvailableNumbersForBoard(board, r, col)
        if (candidates.has(value)) occurrences++
        if (occurrences > 1) break
      }
    }
    if (occurrences === 1) return true

    // Box check
    occurrences = 0
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (board[r][c] === 0) {
          const candidates = getAvailableNumbersForBoard(board, r, c)
          if (candidates.has(value)) occurrences++
          if (occurrences > 1) break
        }
      }
      if (occurrences > 1) break
    }
    if (occurrences === 1) return true

    return false
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

  const isUniquelySolvable = (boardBefore: number[][], row: number, col: number, value: number): boolean => {
    // Create a board snapshot with the candidate placed
    const boardAfter = boardBefore.map(r => [...r])
    boardAfter[row][col] = value

    // 1) Check if placing this value produces any affected cell with a single option
    // This uses the board AFTER placement
    const affectedCells = getAffectedCells(row, col)
    for (const [r, c] of affectedCells) {
      if (boardAfter[r][c] === 0) { // Only check empty cells
        const available = getAvailableNumbersForBoard(boardAfter, r, c)
        if (available.size === 1) {
          return true // This placement creates a unique follow-up elsewhere
        }
      }
    }

    // 2) Check if this placement is the only valid option for this cell on the ORIGINAL board
    const originalCandidates = getAvailableNumbersForBoard(boardBefore, row, col)
    const otherCandidates = Array.from(originalCandidates).filter((n: number) => n !== value)
    for (const candidate of otherCandidates) {
      // If any alternative candidate does not conflict on the original board,
      // then our chosen value is not unique for this cell.
      if (!hasConflicts(boardBefore, row, col, candidate)) {
        return false
      }
    }
    return true
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