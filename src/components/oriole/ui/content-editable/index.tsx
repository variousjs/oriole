import React from 'react'
import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable'
import csses from './index.less'

export const rootClassName = 'content-editable-root'

interface Props {
  placeholder?: string,
}

const ContentEditable = (props: Props) => {
  const { placeholder = 'Enter some text...' } = props

  return (
    <LexicalContentEditable
      className={`${csses.contentEditable} ${rootClassName}`}
      aria-placeholder={placeholder}
      placeholder={(
        <div className={csses.placeholder}>
          {placeholder}
        </div>
      )}
    />
  )
}

export default ContentEditable
