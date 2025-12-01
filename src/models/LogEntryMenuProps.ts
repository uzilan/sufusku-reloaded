export interface LogEntryMenuProps {
  logId: number
  isOpen: boolean
  onClose: () => void
  onDropEventsAfter?: (logId: number) => void
  onRemoveLog?: (logId: number) => void
  anchorRect: DOMRect
}