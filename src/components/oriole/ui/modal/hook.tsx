import React, { ReactNode, useMemo, useState } from 'react'
import Modal, { Props as ModalProps } from './'

const useModal = () => {
  const [modalContent, setModalContent] = useState<null | Omit<ModalProps, 'onClose'>>(null)

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null
    }
    const { children, closeOnClickOutside} = modalContent
    return (
      <Modal
        onClose={() => setModalContent(null)}
        closeOnClickOutside={closeOnClickOutside}
      >
        {children}
      </Modal>
    );
  }, [modalContent])

  const showModal = (
    getContent: (onClose: ModalProps['onClose']) => ReactNode,
    closeOnClickOutside?: boolean,
  ) => {
    setModalContent({
      closeOnClickOutside,
      children: getContent(() => setModalContent(null)),
    })
  }

  return [modal, showModal]
}
export default useModal
