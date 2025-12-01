import React, { useState, useRef, useEffect } from 'react'
import { CAlert } from '@coreui/react'
import BoardManager from './components/BoardManager'
import LogManager from './components/LogManager'
import ControlPanel from './components/ControlPanel'
import Instructions from './components/Instructions'
import { useSudokuSolver } from './hooks/useSudokuSolver'
import { BoardManagerRef, LogManagerRef } from './models'
import './App.css'

const App: React.FC = () => {
  const [board, setBoard] = useState<number[][]>(() => {
    return Array(9).fill(null).map(() => Array(9).fill(0))
  })
  const [frozenCells, setFrozenCells] = useState<Set<string>>(new Set())
  const [logs, setLogs] = useState<Array<{ id: number; message: string; type: string; hasError: boolean; boardState: number[][] }>>([])
  const [selectedLog, setSelectedLog] = useState<number | null>(null)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [logIdCounter, setLogIdCounter] = useState(1)
  const [_isFrozen, setIsFrozen] = useState(false)
  const [isInstructionsVisible, setIsInstructionsVisible] = useState(false)
  
  const boardManagerRef = useRef<BoardManagerRef>(null)
  const logManagerRef = useRef<LogManagerRef>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  
  const { findCorrectValue, showAlert, hideAlert, alertVisible, alertMessage } = useSudokuSolver(board)

  // removed unused addLog (use addLogWithBoardState instead)

  // (Removed mobile scroll-to-top behavior)

  const addLogWithBoardState = (message: string, type: string = 'info', hasError: boolean = false, boardState: number[][]) => {
    const newLog = {
      id: logIdCounter,
      message,
      type,
      hasError,
      boardState: boardState.map(row => [...row])
    }
    setLogs(prev => [...prev, newLog])
    setLogIdCounter(prev => prev + 1)
  }

  const handleCellChange = (row: number, col: number, value: number) => {
    if (frozenCells.has(`${row}-${col}`)) {
      return
    }

    const newBoard = board.map(rowArray => [...rowArray])
    newBoard[row][col] = value
    setBoard(newBoard)

    // Convert coordinates to letter-number format (e.g., A1, B2, etc.)
    const colLetter = String.fromCharCode(65 + col) // A=0, B=1, etc.
    const rowNumber = row + 1 // 1-based row numbers
    const cellPosition = `${colLetter}${rowNumber}`

    // Check for duplicates
    const hasDuplicates = checkForDuplicates(newBoard, row, col, value)
    
    if (value === 0) {
      addLogWithBoardState(`${cellPosition}: deleted`, 'info', false, newBoard)
    } else if (hasDuplicates) {
      addLogWithBoardState(`${cellPosition}: ${value}`, 'error', true, newBoard)
    } else {
      addLogWithBoardState(`${cellPosition}: ${value}`, 'success', false, newBoard)
    }

    // Removed automatic scroll-to-top on mobile after entering a number
  }

  const checkForDuplicates = (boardState: number[][], row: number, col: number, value: number): boolean => {
    if (value === 0) return false

    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && boardState[row][c] === value) {
        return true
      }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && boardState[r][col] === value) {
        return true
      }
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3
    const boxCol = Math.floor(col / 3) * 3
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if ((r !== row || c !== col) && boardState[r][c] === value) {
          return true
        }
      }
    }

    return false
  }

  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear the board? This will also clear all logs.')) {
      const emptyBoard = Array(9).fill(null).map(() => Array(9).fill(0))
      setBoard(emptyBoard)
      setFrozenCells(new Set())
      setLogs([])
      setSelectedLog(null)
      setSelectedCell(null)
      setLogIdCounter(1)
      setIsFrozen(false)
    }
  }

  const handleFreezeBoard = () => {
    const newFrozenCells = new Set<string>()
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0) {
          newFrozenCells.add(`${row}-${col}`)
        }
      }
    }
    setFrozenCells(newFrozenCells)
    setIsFrozen(true)
    addLogWithBoardState('Board frozen', 'info', false, board)
  }

  const handleSolve = () => {
    if (!selectedCell) {
      showAlert('Please select a cell first')
      return
    }

    const [row, col] = selectedCell
    if (board[row][col] !== 0) {
      showAlert('Selected cell is already filled')
      return
    }

    const correctValue = findCorrectValue(row, col)
    if (correctValue !== null) {
      handleCellChange(row, col, correctValue)
    } else {
      showAlert('Cannot determine a unique solution for this cell')
    }
  }

  const handleLogClick = (log: { id: number; boardState: number[][] }) => {
    setSelectedLog(log.id)
    setBoard(log.boardState.map(row => [...row]))
  }

  const handleDropEventsAfter = (logId: number) => {
    const logIndex = logs.findIndex(log => log.id === logId)
    if (logIndex === -1) return

    const newLogs = logs.slice(0, logIndex + 1)
    setLogs(newLogs)
    
    // Recalculate board states for remaining logs
    const recalculatedLogs = newLogs.map((log, index) => {
      if (index === 0) {
        return { ...log, boardState: log.boardState }
      }
      // For subsequent logs, we need to rebuild the board state
      // This is a simplified approach - in a real app you'd want to track the actual changes
      return { ...log, boardState: log.boardState }
    })
    setLogs(recalculatedLogs)
    setSelectedLog(null)

    // Set the board to the state of the last remaining log, or empty if no logs
    if (recalculatedLogs.length > 0) {
      setBoard(recalculatedLogs[recalculatedLogs.length - 1].boardState.map(row => [...row]))
    } else {
      setBoard(Array(9).fill(null).map(() => Array(9).fill(0)))
    }
  }

  const handleRemoveLog = (logId: number) => {
    const logIndex = logs.findIndex(log => log.id === logId)
    
    const removedLog = logs[logIndex]
    const newLogs = logs.filter(log => log.id !== logId)
    setLogs(newLogs)
    setSelectedLog(null)

    // Start with the current board state
    const replayBoard = board.map(row => [...row])
    
    // Parse the removed log message to find which cell was changed
    // Format: "A1: 1", "B2: deleted", etc.
    const message = removedLog.message
    const match = message.match(/^([A-I])([1-9]):\s*(.+)$/)
    
    if (match) {
      const colLetter = match[1]
      const rowNumber = parseInt(match[2])
      const value = match[3]
      
      // Convert to array indices
      const col = colLetter.charCodeAt(0) - 65 // A=0, B=1, etc.
      const row = rowNumber - 1 // 1-based to 0-based
      
      if (value === 'deleted') {
        // If it was a deletion, we need to find what the value was before
        // Look at the previous log's board state
        if (logIndex > 0) {
          const previousLog = logs[logIndex - 1]
          replayBoard[row][col] = previousLog.boardState[row][col]
        } else {
          replayBoard[row][col] = 0
        }
      } else {
        // If it was a value set, revert to the previous value
        if (logIndex > 0) {
          const previousLog = logs[logIndex - 1]
          replayBoard[row][col] = previousLog.boardState[row][col]
        } else {
          replayBoard[row][col] = 0
        }
      }
    }
    setBoard(replayBoard)
  }

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell([row, col])
  }

  // Global click handler to dismiss alert and clear selected cell
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Dismiss alert if visible
      if (alertVisible) {
        hideAlert()
      }
      
      // Clear selected cell if clicking outside the board
      const target = e.target as Element
      if (!target.closest('.grid-container') && !target.closest('.control-panel')) {
        setSelectedCell(null)
      }
    }

    document.addEventListener('click', handleGlobalClick)
    return () => {
      document.removeEventListener('click', handleGlobalClick)
    }
  }, [alertVisible, hideAlert])

  // No-op: log panel is always visible now, no resize handling needed

  // Measure bottom control panel height and expose it as a CSS variable
  useEffect(() => {
    const setControlsHeightVar = () => {
      const h = controlsRef.current?.offsetHeight || 0
      document.documentElement.style.setProperty('--controls-height', `${h}px`)
    }

    setControlsHeightVar()

    // Update on window resize
    const onResize = () => setControlsHeightVar()
    window.addEventListener('resize', onResize)

    // Observe the control panel size changes (e.g., label changes, wrapping)
    const win = window as Window & typeof globalThis
    const RO = win.ResizeObserver
    const targetEl = controlsRef.current
    const ro: ResizeObserver | null = RO ? new RO(() => { setControlsHeightVar() }) : null
    if (ro && targetEl) {
      ro.observe(targetEl)
    }

    return () => {
      window.removeEventListener('resize', onResize)
      if (ro) {
        if (targetEl) {
          try { ro.unobserve(targetEl) } catch {}
        }
        // Ensure observer is disconnected to avoid leaks
        try { ro.disconnect?.() } catch {}
      }
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">Sufusku</h1>
      </header>
      
      <Instructions 
        isVisible={isInstructionsVisible}
        onToggle={() => setIsInstructionsVisible(!isInstructionsVisible)}
        hideToggle={alertVisible}
      />
      
      <main className="main-content">
        <div className="game-container">
          <div className="left-panel">
            <BoardManager
              ref={boardManagerRef}
              board={board}
              frozenCells={frozenCells}
              selectedCell={selectedCell}
              onCellChange={handleCellChange}
              onCellClick={handleCellClick}
            />
          </div>
          <div className="right-panel">
            <div ref={controlsRef} className="controls-anchor">
              <ControlPanel
                onClearBoard={handleClearBoard}
                onFreezeBoard={handleFreezeBoard}
                onSolve={handleSolve}
                selectedCell={selectedCell}
              />
            </div>
            <div className="log-panel-container">
              <div className="log-panel" id="log-panel">
                <LogManager
                  ref={logManagerRef}
                  logs={logs}
                  selectedLog={selectedLog}
                  onLogClick={handleLogClick}
                  onDropEventsAfter={handleDropEventsAfter}
                  onRemoveLog={handleRemoveLog}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Alert */}
      {alertVisible && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, maxWidth: '300px' }}>
          <CAlert 
            color="warning" 
            dismissible
            onClose={hideAlert}
            style={{ margin: 0 }}
          >
            {alertMessage}
          </CAlert>
        </div>
      )}
    </div>
  )
}

export default App