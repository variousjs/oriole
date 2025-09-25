import React, { useState } from 'react'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'

import ContentEditable from './ui/content-editable'
import ToolbarPlugin, {ToolbarActions } from './plugins/toolbar'
import csses from './editor.less'

interface Props {
  placeholder?: string,
  maxLength?: number,
  toolbar: ToolbarActions,
}

const Editor = (props: Props) => {
  const isEditable = useLexicalEditable()
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)

  const onEditorRef = (element: HTMLDivElement) => {
    if (element !== null) {
      setFloatingAnchorElem(element)
    }
  }

  return (
    <div className={csses.editorContainer}>
      <ToolbarPlugin actions={props.toolbar} />
      <AutoFocusPlugin />
      <ClearEditorPlugin />
      <HashtagPlugin />
      <HistoryPlugin />
      <RichTextPlugin
        contentEditable={
          <div className={csses.editor} ref={onEditorRef}>
            <ContentEditable placeholder={props.placeholder} />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin hasStrictIndent />
      <CheckListPlugin />
      <TablePlugin hasHorizontalScroll />
      <ClickableLinkPlugin disabled={isEditable} />
      <HorizontalRulePlugin />
      <TabIndentationPlugin maxIndent={5} />
      {
        props.maxLength ? <CharacterLimitPlugin
          charset="UTF-8"
          maxLength={props.maxLength}
        /> : null
      }
    </div>
  )
}

export default Editor
