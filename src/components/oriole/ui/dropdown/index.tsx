import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { isDOMNode } from 'lexical'
import DropDownItems from './items'
import { Down } from '../icons'
import csses from './index.less'

export { default as DropDownItem } from './item'

interface Props {
  disabled?: boolean,
  label: ReactNode,
  children: ReactNode,
}

const DROP_DOWN_PADDING = 4

const getDropDownTopLeft = (trigger: HTMLDivElement, dropDown: HTMLDivElement) => {
  const { top, left } = trigger.getBoundingClientRect()
  const dropDownTop = `${top + trigger.offsetHeight + DROP_DOWN_PADDING}px`
  const dropDownLeft = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`
  return { top: dropDownTop, left: dropDownLeft }
}

const DropDown = (props: Props) => {
  const dropDownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [showDropDown, setShowDropDown] = useState(false)

  const handleClose = () => {
    setShowDropDown(false)
  }

  useEffect(() => {
    const trigger = triggerRef.current

    if (trigger && showDropDown) {
      const handle = (event: MouseEvent) => {
        const { target } = event

        if (!isDOMNode(target)) {
          return
        }

        if (!trigger.contains(target) && !dropDownRef.current?.contains(target)) {
          setShowDropDown(false)
        }
      }
      document.addEventListener('click', handle)

      return () => {
        document.removeEventListener('click', handle)
      }
    }

    return () => null
  }, [dropDownRef, triggerRef, showDropDown])

  useEffect(() => {
    const handlePositionUpdate = () => {
      if (showDropDown) {
        const trigger = triggerRef.current
        const dropDown = dropDownRef.current

        if (trigger && dropDown) {
          const { top, left } = getDropDownTopLeft(trigger, dropDown)

          dropDown.style.top = top
          dropDown.style.left = left
        }
      }
    }

    handlePositionUpdate()

    document.addEventListener('scroll', handlePositionUpdate)
    window.addEventListener('resize', handlePositionUpdate)

    return () => {
      document.removeEventListener('scroll', handlePositionUpdate)
      window.removeEventListener('resize', handlePositionUpdate)
    }
  }, [triggerRef, dropDownRef, showDropDown])

  return (
    <>
      <div
        className={`${csses.trigger} ${props.disabled ? csses.disabled : ''}`}
        onClick={() => {
          if (props.disabled) {
            return
          }
          setShowDropDown(!showDropDown)
        }}
        ref={triggerRef}
      >
        {props.label}
        <Down />
      </div>

      {showDropDown &&
        createPortal(
          <DropDownItems dropDownRef={dropDownRef} onClose={handleClose}>
            {props.children}
          </DropDownItems>,
          document.body,
        )}
    </>
  )
}

export default DropDown
