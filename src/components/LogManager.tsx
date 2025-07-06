import { forwardRef, useImperativeHandle } from 'react'
import LogContainer from './LogContainer'
import { LogManagerProps, LogManagerRef } from '../models'

const LogManager = forwardRef<LogManagerRef, LogManagerProps>(({
  logs,
  selectedLog,
  onLogClick,
  onDropEventsAfter,
  onRemoveLog
}, ref) => {
  // Expose addLog through ref for backward compatibility
  useImperativeHandle(ref, () => ({
    addLog: (message: string, type: string, hasError?: boolean) => {
      // This is now handled by the parent component
      console.log('addLog called from ref - should be handled by parent')
    }
  }))

  return (
    <div className="log-section">
      <LogContainer 
        logs={logs} 
        maxLogs={50} 
        onLogClick={onLogClick} 
        onDropEventsAfter={onDropEventsAfter} 
        onRemoveLog={onRemoveLog} 
        selectedLogId={selectedLog} 
      />
    </div>
  )
})

LogManager.displayName = 'LogManager'

export default LogManager 