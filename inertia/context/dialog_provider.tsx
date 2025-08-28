import { createContext, useContext, useMemo, useState } from 'react'

type Action = 'create' | 'update' | 'delete' | 'import' | null

interface DialogContextType<T> {
  isOpen: boolean
  setOpen: (open: boolean) => void
  action: Action
  setAction: (newAction: Action) => void
  open: () => void
  close: (cleanupData: boolean) => void
  setData: (newData: T | undefined) => void
  data: T | undefined
  openWithAction: (action: Action, data?: T) => void
}

const DialogContext = createContext<DialogContextType<any> | undefined>(undefined)

export function DialogProvider<T>({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [action, setAction] = useState<Action>(null)
  const [data, setData] = useState<T | undefined>(undefined)

  const openWithAction = (action: Action, data?: T) => {
    if (action === 'create' || action === 'import') setData(undefined)
    else setData(data)

    setAction(action)
    open()
  }

  const close = (cleanupData: boolean = true) => {
    if (cleanupData)
      setData(undefined)
    
    setAction(null)
    setIsOpen(false)
  }

  const value = useMemo<DialogContextType<T>>(
    () => ({
      isOpen,
      setOpen: setIsOpen,
      action,
      setAction,
      open: () => setIsOpen(true),
      close: close,
      setData: setData,
      data,
      openWithAction: openWithAction,
    }),
    [isOpen, data]
  )

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

export function useDialog<T>() {
  const context = useContext(DialogContext)
  if (!context) throw new Error('useDialog must be used within a DialogProvider')

  return context as DialogContextType<T>
}
