import React from 'react'
import { LogEntryMenuProps } from '../models'

const LogEntryMenu: React.FC<LogEntryMenuProps> = ({
  logId,
  onClose,
  onDropEventsAfter,
  onRemoveLog
}) => {
  return (
    <div className="log-entry-menu">
      <button
        className="log-menu-button"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (onRemoveLog) {
            onRemoveLog(logId)
          }
          onClose()
        }}
      >
        Remove this entry
      </button>
      <button
        className="log-menu-button"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fa'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (onDropEventsAfter) {
            onDropEventsAfter(logId)
          }
          onClose()
        }}
      >
        Drop all events after this
      </button>
    </div>
  )
}

export default LogEntryMenu 