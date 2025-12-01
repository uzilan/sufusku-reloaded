import React, { useEffect, useMemo } from 'react'
import { LogEntryMenuProps } from '../models'

const LogEntryMenu: React.FC<LogEntryMenuProps> = ({
  logId,
  onClose,
  onDropEventsAfter,
  onRemoveLog,
  anchorRect,
}) => {
  // Compute fixed viewport coordinates for the menu, flipping up if needed
  const { top, left } = useMemo(() => {
    const viewportPadding = 6
    const estimatedWidth = 220
    const estimatedHeight = 96 // ~ two buttons
    // Prefer below, aligned to right edge of button
    let t = anchorRect.bottom + 4
    const l = Math.min(
      Math.max(anchorRect.right - estimatedWidth, viewportPadding),
      window.innerWidth - estimatedWidth - viewportPadding
    )
    // If not enough space below, flip above
    if (t + estimatedHeight > window.innerHeight - viewportPadding) {
      t = Math.max(anchorRect.top - estimatedHeight - 4, viewportPadding)
    }
    return { top: t, left: l }
  }, [anchorRect])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div>
      {/* Backdrop to catch outside clicks */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'transparent',
          zIndex: 9999,
        }}
      />
      <div
        className="log-entry-menu"
        style={{
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 10000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
    </div>
  )
}

export default LogEntryMenu 