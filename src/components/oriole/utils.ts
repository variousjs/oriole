import { $isAtNodeEnd } from '@lexical/selection'
import { $isRootOrShadowRoot, LexicalNode, RangeSelection } from 'lexical'
import { $findMatchingParent } from '@lexical/utils'

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
