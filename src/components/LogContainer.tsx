import React, { useEffect } from 'react'
import LogEntry from './LogEntry'
import { LogContainerProps } from '../models'

const LogContainer: React.FC<LogContainerProps> = ({ 
  logs, 
  maxLogs = 50,
  onLogClick,
  onDropEventsAfter,
  onRemoveLog,
  selectedLogId = null
}) => {
  const displayLogs = logs.slice(-maxLogs) // Show only the most recent logs

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (_event: MouseEvent) => {
      // This is now handled by individual LogEntry components
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="log-container">
      <h3 className="log-header">
        Activity Log
      </h3>
      
      <div className="log-entries">
        {displayLogs.length === 0 ? (
          <div className="log-empty">
            No activity yet...
          </div>
        ) : (
          displayLogs.map((log) => (
            <LogEntry
              key={log.id}
              log={log}
              isSelected={selectedLogId === log.id}
              onLogClick={onLogClick}
              onDropEventsAfter={onDropEventsAfter}
              onRemoveLog={onRemoveLog}
            />
          ))
        )}
      </div>
      
      <div className="log-footer">
        Showing {displayLogs.length} of {logs.length} logs
      </div>
    </div>
  )
}

export default LogContainer 