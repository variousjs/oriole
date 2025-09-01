import React, { useState } from 'react'
import { LexicalEditor } from 'lexical'
import { INSERT_IMAGE_COMMAND, InsertImagePayload } from './'

interface Props {
  activeEditor: LexicalEditor,
  onClose: () => void,
}

const InsertImage = (props: Props) => {
  const [mode, setMode] = useState<'url' | 'file'>()

  const onClick = (payload: InsertImagePayload) => {
    props.activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
    props.onClose()
  }

  return (
    <>
      {!mode && (
        <DialogButtonsList>
          <Button
            data-test-id="image-modal-option-url"
            onClick={() => setMode('url')}>
            URL
          </Button>
          <Button
            data-test-id="image-modal-option-file"
            onClick={() => setMode('file')}>
            File
          </Button>
        </DialogButtonsList>
      )}
    </>
  )
}

export default InsertImage
