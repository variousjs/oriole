import React from 'react'
import { LexicalEditor, REDO_COMMAND, UNDO_COMMAND } from 'lexical'
import { IS_APPLE } from '@lexical/utils'
import Button from '~/ui/button'
import { Redo as R, Undo as U } from '~/ui/icons'
import { useToolbarState } from '../context'

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
      title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
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
      title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
      prefix={<R />}
    />
  )
}
