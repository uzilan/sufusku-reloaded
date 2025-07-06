export interface LogManagerProps {
  logs: Array<{ id: number; message: string; type: string; hasError: boolean; boardState: number[][] }>
  selectedLog: number | null
  onLogClick: (log: { id: number; boardState: number[][] }) => void
  onDropEventsAfter: (logId: number) => void
  onRemoveLog: (logId: number) => void
} 