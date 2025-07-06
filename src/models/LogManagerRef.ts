export interface LogManagerRef {
  addLog: (message: string, type: string, hasError?: boolean) => void
} 