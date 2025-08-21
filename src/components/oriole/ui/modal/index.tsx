import React, { ReactNode, useEffect, useRef } from 'react'
import { isDOMNode } from 'lexical'
import { createPortal } from 'react-dom'

export interface Props {
  children: ReactNode,
  closeOnClickOutside?: boolean,
  onClose: () => void,
}

const PortalImpl = (props: Props) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        props.onClose()
      }
    }

    const clickOutsideHandler = (event: MouseEvent) => {
      const { target } = event

      if (
        modalRef.current &&
        isDOMNode(target) &&
        !modalRef.current.contains(target) &&
        props.closeOnClickOutside
      ) {
        props.onClose()
      }
    }

    const modelElement = modalRef.current
    if (modelElement) {
      modalOverlayElement = modelElement.parentElement
      modalOverlayElement?.addEventListener('click', clickOutsideHandler)
    }

    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
      modalOverlayElement?.removeEventListener('click', clickOutsideHandler)
    }
  }, [props.closeOnClickOutside, props.onClose])

  return (
    <div role="dialog">
      <div tabIndex={-1} ref={modalRef}>
        <i onClick={props.onClose}>X</i>
        <div>{props.children}</div>
      </div>
    </div>
  )
}

const Modal = (props: Props) => {
  return createPortal(
    <PortalImpl {...props} />,
    document.body,
  )
}

export default Modal
