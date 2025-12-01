import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LogEntryProps } from '../models'
import LogEntryMenu from './LogEntryMenu'
import { createPortal } from 'react-dom'

const LogEntry: React.FC<LogEntryProps> = ({
  log,
  isSelected = false,
  onLogClick,
  onDropEventsAfter,
  onRemoveLog
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const btnRef = useRef<HTMLButtonElement | null>(null)

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  // Close on window scroll/resize so we never leave a mispositioned menu
  useEffect(() => {
    if (!isMenuOpen) return
    const onScroll = () => setIsMenuOpen(false)
    const onResize = () => setIsMenuOpen(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    // Also close when the log list (scroll container) scrolls
    let cleanupContainer: (() => void) | null = null
    if (btnRef.current) {
      const container = btnRef.current.closest('.log-entries')
      if (container) {
        const onContainerScroll = () => setIsMenuOpen(false)
        container.addEventListener('scroll', onContainerScroll, { passive: true })
        cleanupContainer = () => container.removeEventListener('scroll', onContainerScroll)
      }
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (cleanupContainer) cleanupContainer()
    }
  }, [isMenuOpen])

  const getLogTypeColor = (type: string): string => {
    switch (type) {
      case 'error':
        return '#dc3545'
      case 'success':
        return '#28a745'
      case 'info':
      default:
        return '#17a2b8'
    }
  }

  const getBackgroundColor = (): string => {
    if (isSelected) {
      return '#d4edda' // Light green for selected
    }
    if (log.hasError) {
      return '#ffebee' // Pink for errors
    }
    return '#f8f9fa' // Light gray for normal
  }

  const getHoverBackgroundColor = (): string => {
    if (isSelected) {
      return '#c3e6cb' // Darker green for selected hover
    }
    if (log.hasError) {
      return '#ffcdd2' // Darker pink for error hover
    }
    return '#e9ecef' // Darker gray for normal hover
  }

  return (
    <div 
      style={{
        marginBottom: '4px',
        padding: '4px',
        borderLeft: `3px solid ${getLogTypeColor(log.type)}`,
        backgroundColor: getBackgroundColor(),
        borderRadius: '2px',
        cursor: onLogClick ? 'pointer' : 'default',
        transition: 'background-color 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        if (onLogClick) {
          e.currentTarget.style.backgroundColor = getHoverBackgroundColor()
        }
      }}
      onMouseOut={(e) => {
        if (onLogClick) {
          e.currentTarget.style.backgroundColor = getBackgroundColor()
        }
      }}
    >
      <div 
        onClick={() => onLogClick && onLogClick(log)}
        style={{ 
          color: '#333',
          wordBreak: 'break-word',
          flex: '1',
          cursor: onLogClick ? 'pointer' : 'default'
        }}
      >
        {log.message}
      </div>
      <button
        className="log-menu-toggle-button"
        ref={btnRef}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#dee2e6'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        onClick={(e) => {
          e.stopPropagation()
          // Compute anchor rect for portal positioning
          const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()
          setAnchorRect(rect)
          setIsMenuOpen((v) => !v)
        }}
      >
        ⋯
      </button>
      
      {/* Dropdown Menu */}
      {isMenuOpen && anchorRect && createPortal(
        <LogEntryMenu
          logId={log.id}
          isOpen={true}
          onDropEventsAfter={onDropEventsAfter}
          onRemoveLog={onRemoveLog}
          onClose={closeMenu}
          anchorRect={anchorRect}
        />,
        document.body
      )}
    </div>
  )
}

export default LogEntry 