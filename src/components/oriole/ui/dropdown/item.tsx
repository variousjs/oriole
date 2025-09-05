import React, { ReactNode, MouseEvent, useRef, useContext, useEffect } from 'react'
import { DropDownContext } from './context'
import csses from './index.less'

interface Props {
  children: ReactNode,
  onClick?: (e: MouseEvent<HTMLDivElement>) => void,
  value?: string,
}

const DropDownItem = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const dropDownContext = useContext(DropDownContext)

  if (dropDownContext === null) {
    throw new Error('DropDownItem must be used within a DropDown')
  }

  const { registerItem, handleClose, value } = dropDownContext

  useEffect(() => {
    if (ref?.current) {
      registerItem(ref)
    }
  }, [ref, registerItem])

  return (
    <div
      className={`${csses.item} ${value?.length && props.value === value ? csses.active : ''}`}
      onClick={(e) => {
        props.onClick?.(e)
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
