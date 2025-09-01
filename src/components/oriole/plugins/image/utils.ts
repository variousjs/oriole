import {
  $createRangeSelection,
  $getSelection,
  $isNodeSelection,
  isHTMLElement,
  LexicalEditor,
} from 'lexical'
import { $findMatchingParent, $setSelection, getDOMSelectionFromTarget } from 'lexical/LexicalUtils'
import {
  $isAutoLinkNode,
  $isLinkNode,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link'
import { $isImageNode, subImageClassName } from '~/nodes/image'
import { THEME_PREFIX } from '~/config'
import { rootClassName } from '~/ui/content-editable'
import { INSERT_IMAGE_COMMAND, InsertImagePayload } from './'

declare global {
  interface DragEvent {
    rangeOffset?: number,
    rangeParent?: Node,
  }
}

const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const transImg = document.createElement('img')
transImg.src = TRANSPARENT_IMAGE

function $getImageNodeInSelection() {
  const selection = $getSelection()

  if (!$isNodeSelection(selection)) {
    return null
  }

  const nodes = selection.getNodes()
  const node = nodes[0]

  return $isImageNode(node) ? node : null
}

export function $onDragStart(event: DragEvent) {
  const node = $getImageNodeInSelection()

  if (!node) {
    return false
  }

  const dataTransfer = event.dataTransfer

  if (!dataTransfer) {
    return false
  }

  dataTransfer.setData('text/plain', '_')
  dataTransfer.setDragImage(transImg, 0, 0)
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  )

  return true
}

function canDropImage(event: DragEvent) {
  const target = event.target
  return !!(
    isHTMLElement(target) &&
    !target.closest(`code, div.${THEME_PREFIX}${subImageClassName}`) &&
    isHTMLElement(target.parentElement) &&
    target.parentElement.closest(`div.${rootClassName}`)
  )
}

export function $onDragover(event: DragEvent) {
  const node = $getImageNodeInSelection()

  if (!node) {
    return false
  }
  if (!canDropImage(event)) {
    event.preventDefault()
  }

  return true
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag')

  if (!dragData) {
    return null
  }

  const { type, data } = JSON.parse(dragData)

  if (type !== 'image') {
    return null
  }

  return data
}

function getDragSelection(event: DragEvent) {
  let range
  const domSelection = getDOMSelectionFromTarget(event.target)

  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0)
    range = domSelection.getRangeAt(0)
  } else {
    console.error('Cannot get the selection when dragging')
    return undefined
  }

  return range
}

export function $onDrop(event: DragEvent, editor: LexicalEditor) {
  const node = $getImageNodeInSelection()

  if (!node) {
    return false
  }

  const data = getDragImageData(event)

  if (!data) {
    return false
  }

  event.preventDefault()

  const existingLink = $findMatchingParent(
    node,
    (parent) => !$isAutoLinkNode(parent) && $isLinkNode(parent),
  ) as LinkNode | null

  if (canDropImage(event)) {
    const range = getDragSelection(event)
    const rangeSelection = $createRangeSelection()

    node.remove()

    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range)
    }

    $setSelection(rangeSelection)

    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data)

    if (existingLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, existingLink.getURL())
    }
  }
  return true
}
