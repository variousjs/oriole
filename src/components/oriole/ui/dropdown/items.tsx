import React, { ReactNode, Ref, RefObject, useCallback, useState, KeyboardEvent, useMemo, useEffect } from 'react'
import { DropDownContext } from './context'
import csses from './index.less'

interface Props {
  children: ReactNode,
  dropDownRef: Ref<HTMLDivElement>,
  onClose: () => void,
}

const DropDownItems = (props: Props) => {
  const [items, setItems] = useState<RefObject<HTMLDivElement>[]>()
  const [highlightedItem, setHighlightedItem] = useState<RefObject<HTMLDivElement>>()

  const registerItem = useCallback((itemRef: RefObject<HTMLDivElement>) => {
    setItems((prev) => (prev ? [...prev, itemRef] : [itemRef]))
  },[setItems])

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!items) {
      return
    }

    const { key, target } = e

    if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter'].includes(key)) {
      e.preventDefault()
    }

    if (key === 'Escape' || key === 'Tab') {
      props.onClose()
    }

    if (key === 'Enter') {
      target.click()
    }

    if (key === 'ArrowUp') {
      setHighlightedItem((prev) => {
        if (!prev) {
          return items[0]
        }
        const index = items.indexOf(prev) - 1
        return items[index === -1 ? items.length - 1 : index]
      })
    }

    if (key === 'ArrowDown') {
      setHighlightedItem((prev) => {
        if (!prev) {
          return items[0]
        }
        return items[items.indexOf(prev) + 1]
      })
    }
  }

  const contextValue = useMemo(() => ({
    registerItem,
    handleClose: props.onClose,
  }),[registerItem, props.onClose])

  useEffect(() => {
    if (items && !highlightedItem) {
      setHighlightedItem(items[0])
    }

    if (highlightedItem?.current) {
      highlightedItem.current.focus()
    }
  }, [items, highlightedItem])

  return (
    <DropDownContext.Provider value={contextValue}>
      <div
        className={csses.items}
        ref={props.dropDownRef}
        onKeyDown={handleKeyDown}
      >
        {props.children}
      </div>
    </DropDownContext.Provider>
  );
}

export default DropDownItems
