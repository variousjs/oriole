import React, { ReactNode, MouseEvent, useRef, useContext, useEffect } from 'react'
import { DropDownContext } from './context'
import csses from './index.less'

interface Props {
  children: ReactNode,
  onClick: (e: MouseEvent<HTMLDivElement>) => void,
}

const DropDownItem = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const dropDownContext = useContext(DropDownContext)

  if (dropDownContext === null) {
    throw new Error('DropDownItem must be used within a DropDown')
  }

  const { registerItem, handleClose } = dropDownContext

  useEffect(() => {
    if (ref?.current) {
      registerItem(ref)
    }
  }, [ref, registerItem])

  return (
    <div
      className={csses.item}
      onClick={(e) => {
        props.onClick(e)
        handleClose()
      }}
      ref={ref}
      tabIndex={-1}
    >
      {props.children}
    </div>
  )
}

export default DropDownItem
