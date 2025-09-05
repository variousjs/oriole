import { createContext, RefObject } from 'react'

export interface Context {
  registerItem: (ref: RefObject<HTMLDivElement>) => void,
  handleClose: () => void,
  value?: string,
}

export const DropDownContext = createContext<Context | null>(null)
