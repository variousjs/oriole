import React, { ReactNode, MouseEvent, useRef, useContext, useEffect } from 'react'
import { DropDownContext } from './context'

interface Props {
  children: ReactNode,
  className?: string,
  onClick: (e: MouseEvent<HTMLDivElement>) => void,
}

const DropDownItem = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const dropDownContext = useContext(DropDownContext)

  if (dropDownContext === null) {
    throw new Error('DropDownItem must be used within a DropDown')
  }

  const { registerItem } = dropDownContext

  useEffect(() => {
    if (ref?.current) {
      registerItem(ref)
    }
  }, [ref, registerItem])

  return (
    <div
      className={props.className}
      onClick={props.onClick}
      ref={ref}
    >
      {props.children}
    </div>
  )
}

export default DropDownItem
