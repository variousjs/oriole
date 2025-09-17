import React from 'react'
import {
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { HeadingTagType } from '@lexical/rich-text'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { useToolbarState } from './context'
import { formatCode, formatHeading, formatParagraph, formatQuote } from './utils'
import Button, { Props as ButtonProps } from '~/ui/button'
import * as Icons from '~/ui/icons'

export interface Props {
  blockType?: 'button' | 'dropdown',
}

const ButtonWrap = (props: ButtonProps & Props) => {
  const { blockType = 'button', title, ...rest } = props
  return (
    <Button
      {...rest}
      title={blockType === 'button' ? title : undefined}
    >
      {blockType === 'dropdown' ? title : null}
    </Button>
  )
}

const Heading = (props: Props & { type: HeadingTagType }) => {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()
  const size = props.type.slice(1)

  if (activeEditor !== editor) {
    return null
  }

  const Icon = Icons[`H${size}` as 'H1']

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => formatHeading(activeEditor, props.type)}
      active={toolbarState.blockType === props.type}
      title={`Heading ${size}`}
      prefix={<Icon />}
    />
  )
}

export const H1 = (props: Props) => <Heading {...props} type="h1" />
export const H2 = (props: Props) => <Heading {...props} type="h2" />
export const H3 = (props: Props) => <Heading {...props} type="h3" />
export const H4 = (props: Props) => <Heading {...props} type="h4" />
export const H5 = (props: Props) => <Heading {...props} type="h5" />
export const H6 = (props: Props) => <Heading {...props} type="h6" />

export const Undo = (props: Props) => {
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  return (
    <ButtonWrap
      {...props}
      disabled={!toolbarState.canUndo || !isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
      }}
      title="Undo"
      prefix={<Icons.Undo />}
    />
  )
}

export const Redo = (props: Props) => {
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  return (
    <ButtonWrap
      {...props}
      disabled={!toolbarState.canRedo || !isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(REDO_COMMAND, undefined)
      }}
      title="Redo"
      prefix={<Icons.Redo />}
    />
  )
}

export const Bold = (props: Props) => {
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (toolbarState.blockType === 'code') {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
      }}
      active={toolbarState.isBold}
      title="Bold"
      prefix={<Icons.Bold />}
    />
  )
}

export const Italic = (props: Props) => {
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (toolbarState.blockType === 'code') {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
      }}
      active={toolbarState.isItalic}
      title="Italic"
      prefix={<Icons.Italic />}
    />
  )
}

export const Underline = (props: Props) => {
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (toolbarState.blockType === 'code') {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
      }}
      active={toolbarState.isUnderline}
      title="Underline"
      prefix={<Icons.Underline />}
    />
  )
}

export const Code = (props: Props) => {
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (toolbarState.blockType === 'code') {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
      }}
      active={toolbarState.isCode}
      title="Code"
      prefix={<Icons.Code />}
    />
  )
}

export const Paragraph = (props: Props) => {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (activeEditor !== editor) {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => formatParagraph(activeEditor)}
      active={toolbarState.blockType === 'paragraph'}
      title="Text"
      prefix={<Icons.Text />}
    />
  )
}

export const NumberList = (props: Props) => {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (activeEditor !== editor) {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
      }}
      active={toolbarState.blockType === 'number'}
      title="NumberList"
      prefix={<Icons.NumberList />}
    />
  )
}

export const BulletList = (props: Props) => {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (activeEditor !== editor) {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
      }}
      active={toolbarState.blockType === 'bullet'}
      title="BulletList"
      prefix={<Icons.List />}
    />
  )
}

export const CheckList = (props: Props) => {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (activeEditor !== editor) {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => {
        activeEditor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
      }}
      active={toolbarState.blockType === 'check'}
      title="CheckList"
      prefix={<Icons.CheckList />}
    />
  )
}

export const Quote = (props: Props) => {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (activeEditor !== editor) {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => formatQuote(activeEditor)}
      active={toolbarState.blockType === 'quote'}
      title="Quote"
      prefix={<Icons.Quote />}
    />
  )
}

export const CodeBlock = (props: Props) => {
  const [editor] = useLexicalComposerContext()
  const { toolbarState, activeEditor } = useToolbarState()
  const isEditable = useLexicalEditable()

  if (activeEditor !== editor) {
    return null
  }

  return (
    <ButtonWrap
      {...props}
      disabled={!isEditable}
      onClick={() => formatCode(activeEditor)}
      active={toolbarState.blockType === 'code'}
      title="CodeBlock"
      prefix={<Icons.CodeBlock />}
    />
  )
}
