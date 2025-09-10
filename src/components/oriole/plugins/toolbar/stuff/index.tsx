import React from 'react'
import { FORMAT_TEXT_COMMAND, LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from 'lexical'
import Button from '~/ui/button'
import {
  Redo as R,
  Undo as U,
  Bold as B,
  Italic as I,
} from '~/ui/icons'
import { useToolbarState } from '../context'
import csses from './index.less'

interface Props {
  isEditable: boolean,
  activeEditor: LexicalEditor,
}

export const Undo = (props: Props) => {
  const { toolbarState } = useToolbarState()

  return (
    <Button
      disabled={!toolbarState.canUndo || !props.isEditable}
      onClick={() => {
        props.activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
      }}
      title="Undo"
      prefix={<U />}
    />
  )
}

export const Redo = (props: Props) => {
  const { toolbarState } = useToolbarState()

  return (
    <Button
      disabled={!toolbarState.canRedo || !props.isEditable}
      onClick={() => {
        props.activeEditor.dispatchCommand(REDO_COMMAND, undefined);
      }}
      title="Redo"
      prefix={<R />}
    />
  )
}

export const Bold = (props: Props) => {
  const { toolbarState } = useToolbarState()

  return (
    <Button
      disabled={!props.isEditable}
      onClick={() => {
        props.activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }}
      active={toolbarState.isBold}
      title="Bold"
      prefix={<B />}
    />
  )
}

export const Italic = (props: Props) => {
  const { toolbarState } = useToolbarState()

  return (
    <Button
      disabled={!props.isEditable}
      onClick={() => {
        props.activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }}
      active={toolbarState.isItalic}
      title="Italic"
      prefix={<I />}
    />
  )
}
