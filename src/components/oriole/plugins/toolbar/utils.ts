import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
} from 'lexical'
import { $isAtNodeEnd, $setBlocksType } from '@lexical/selection'
import { $findMatchingParent } from '@lexical/utils'
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text'
import { $createCodeNode } from '@lexical/code'

export function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()

  if (anchorNode === focusNode) {
    return anchorNode;
  }

  const isBackward = selection.isBackward()

  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  }

  return $isAtNodeEnd(anchor) ? anchorNode : focusNode
}

export function $findTopLevelElement(node: LexicalNode) {
  let topLevelElement = node.getKey() === 'root'
    ? node
    : $findMatchingParent(node, (e) => {
        const parent = e.getParent()
        return parent !== null && $isRootOrShadowRoot(parent)
      })

  if (topLevelElement === null) {
    topLevelElement = node.getTopLevelElementOrThrow()
  }

  return topLevelElement
}

export function formatParagraph(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createParagraphNode())
  })
}

export function formatHeading(
  editor: LexicalEditor,
  headingSize: HeadingTagType,
) {
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createHeadingNode(headingSize))
  })
}

export function formatQuote(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createQuoteNode())
  })
}

export function formatCode(editor: LexicalEditor) {
  editor.update(() => {
    let selection = $getSelection()

    if (!selection) {
      return
    }

    if (!$isRangeSelection(selection) || selection.isCollapsed()) {
      $setBlocksType(selection, () => $createCodeNode())
      return
    }

    const textContent = selection.getTextContent()
    const codeNode = $createCodeNode()

    selection.insertNodes([codeNode])
    selection = $getSelection()

    if ($isRangeSelection(selection)) {
      selection.insertRawText(textContent)
    }
  })
}
