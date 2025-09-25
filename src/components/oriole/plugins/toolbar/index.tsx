import React, { useCallback, useEffect, useState } from 'react'
import {
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  LexicalNode,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { $getSelectionStyleValueForProperty, $isParentElementRTL } from '@lexical/selection'
import { $isLinkNode } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { $isTableNode, $isTableSelection } from '@lexical/table'
import {$isHeadingNode} from '@lexical/rich-text'
import { $isCodeNode, normalizeCodeLanguage } from '@lexical/code'

import { useToolbarState } from './context'
import { DEFAULT_FONT_COLOR, DEFAULT_BACKGROUND_COLOR, DEFAULT_FONT_FAMILY } from '~/config'
import { getSelectedNode, $findTopLevelElement } from './utils'
import { blockTypeToBlockName, DEFAULT_FONT_SIZE } from './config'
// import BlockFormat from './block-format'
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  FormatCode,
} from './stuff'
import { ToolbarActions } from './types'
import ActionsMap from './map'
import csses from './index.less'

export type { ToolbarActions } from './types'

export interface Props {
  actions: ToolbarActions
}

const Toolbar = (props: Props) => {
  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()
  const {
    toolbarState,
    updateToolbarState,
    activeEditor,
    setActiveEditor,
  } = useToolbarState()
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null)

  const $handleHeadingNode = useCallback(
    (selectedElement: LexicalNode) => {
      const type = $isHeadingNode(selectedElement)
        ? selectedElement.getTag()
        : selectedElement.getType()

      if (type in blockTypeToBlockName) {
        updateToolbarState(
          'blockType',
          type as keyof typeof blockTypeToBlockName,
        );
      }
    },
    [updateToolbarState],
  )

  const $handleCodeNode = useCallback(
    (element: LexicalNode) => {
      if ($isCodeNode(element)) {
        const language = element.getLanguage()
        updateToolbarState(
          'codeLanguage',
          language
            ? normalizeCodeLanguage(language) || language
            : '',
        );
        const theme = element.getTheme()
        updateToolbarState('codeTheme', theme || '')
      }
    },
    [updateToolbarState],
  )

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      const element = $findTopLevelElement(anchorNode)
      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      updateToolbarState('isRTL', $isParentElementRTL(selection))

      const node = getSelectedNode(selection)
      const parent = node.getParent()
      const isLink = $isLinkNode(parent) || $isLinkNode(node)
      updateToolbarState('Link', isLink)

      const tableNode = $findMatchingParent(node, $isTableNode)
      if ($isTableNode(tableNode)) {
        updateToolbarState('rootType', 'table')
      } else {
        updateToolbarState('rootType', 'root')
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey)
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          )
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState('blockType', type)
        } else {
          $handleHeadingNode(element)
          $handleCodeNode(element)
        }
      }

      updateToolbarState(
        'fontColor',
        $getSelectionStyleValueForProperty(selection, 'color', DEFAULT_FONT_COLOR),
      )
      updateToolbarState(
        'bgColor',
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          DEFAULT_BACKGROUND_COLOR,
        ),
      )
      updateToolbarState(
        'fontFamily',
        $getSelectionStyleValueForProperty(selection, 'font-family', DEFAULT_FONT_FAMILY),
      )

      let matchingParent
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        )
      }

      // If matchingParent is a valid node, pass it's format type
      updateToolbarState(
        'elementFormat',
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || 'left',
      )
    }

    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // Update text format
      updateToolbarState('Bold', selection.hasFormat('bold'))
      updateToolbarState('Italic', selection.hasFormat('italic'))
      updateToolbarState('Underline', selection.hasFormat('underline'))
      updateToolbarState('Strikethrough', selection.hasFormat('strikethrough'))
      updateToolbarState('Subscript', selection.hasFormat('subscript'))
      updateToolbarState('Superscript', selection.hasFormat('superscript'))
      updateToolbarState('Highlight', selection.hasFormat('highlight'))
      updateToolbarState('Code', selection.hasFormat('code'))
      updateToolbarState(
        'fontSize',
        $getSelectionStyleValueForProperty(selection, 'font-size', `${DEFAULT_FONT_SIZE}px`),
      )
      updateToolbarState('Lowercase', selection.hasFormat('lowercase'))
      updateToolbarState('Uppercase', selection.hasFormat('uppercase'))
      updateToolbarState('Capitalize', selection.hasFormat('capitalize'))
    }

    if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes()

      for (const selectedNode of nodes) {
        const parentList = $getNearestNodeOfType<ListNode>(
          selectedNode,
          ListNode,
        )

        if (parentList) {
          const type = parentList.getListType()
          updateToolbarState('blockType', type)
        } else {
          const selectedElement = $findTopLevelElement(selectedNode)
          $handleHeadingNode(selectedElement)
          $handleCodeNode(selectedElement)
          // Update elementFormat for node selection (e.g., images)
          if ($isElementNode(selectedElement)) {
            updateToolbarState(
              'elementFormat',
              selectedElement.getFormatType(),
            )
          }
        }
      }
    }
  }, [
    activeEditor,
    editor,
    updateToolbarState,
    $handleHeadingNode,
    $handleCodeNode,
  ])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor)
        $updateToolbar()
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor, $updateToolbar, setActiveEditor])

  useEffect(() => {
    activeEditor.getEditorState().read(
      () => {
        $updateToolbar()
      },
      {editor: activeEditor},
    )
  }, [activeEditor, $updateToolbar])

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          {editor: activeEditor},
        )
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState('Undo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState('Redo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor, updateToolbarState])

  return (
    <div className={csses.toolbar}>
      {/* <Undo activeEditor={activeEditor} isEditable={isEditable} /> */}
      {/* <Redo activeEditor={activeEditor} isEditable={isEditable} /> */}
      {/* <BlockFormat
        disabled={!isEditable}
        blockType={toolbarState.blockType}
        editor={activeEditor}
        activeEditor={activeEditor}
      /> */}
      {/* <Bold activeEditor={activeEditor} isEditable={isEditable} /> */}
      {/* <Italic activeEditor={activeEditor} isEditable={isEditable} /> */}
      {/* <Underline activeEditor={activeEditor} isEditable={isEditable} /> */}
      {/* <FormatCode activeEditor={activeEditor} isEditable={isEditable} /> */}
      <ActionsMap actions={props.actions} />
    </div>
  )
}

export default Toolbar
