import React, { RefObject, useRef } from 'react'
import { LexicalEditor } from 'lexical'
import { calculateZoomLevel } from '@lexical/utils'
import csses from './index.less'

function clampNum(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

const Direction = {
  east: 1 << 0,
  north: 1 << 3,
  south: 1 << 1,
  west: 1 << 2,
}

const MIN_WIDTH = 100

interface Props {
  editor: LexicalEditor,
  imageRef: RefObject<HTMLImageElement | null>,
  maxWidth?: number,
  onResizeEnd: (width: 'inherit' | number, height: 'inherit' | number) => void,
  onResizeStart: () => void,
}

interface Position {
  currentHeight: 'inherit' | number,
  currentWidth: 'inherit' | number,
  direction: number,
  isResizing: boolean,
  ratio: number,
  startHeight: number,
  startWidth: number,
  startX: number,
  startY: number,
}

const ImageResizer = (props: Props) => {
  const { editor, imageRef, maxWidth } = props
  const controlWrapperRef = useRef<HTMLDivElement>(null)
  const positioningRef = useRef<Position>({
    currentHeight: 0,
    currentWidth: 0,
    direction: 0,
    isResizing: false,
    ratio: 0,
    startHeight: 0,
    startWidth: 0,
    startX: 0,
    startY: 0,
  })
  const userSelect = useRef({
    priority: '',
    value: 'default',
  })

  const editorRootElement = editor.getRootElement()
  const maxWidthContainer = maxWidth
    ? maxWidth
    : editorRootElement !== null
    ? editorRootElement.getBoundingClientRect().width - 20
    : 100

  const setStartCursor = () => {
    const cursorDir = 'ew'

    if (editorRootElement !== null) {
      editorRootElement.style.setProperty(
        'cursor',
        `${cursorDir}-resize`,
        'important',
      )
    }

    if (document.body !== null) {
      document.body.style.setProperty(
        'cursor',
        `${cursorDir}-resize`,
        'important',
      )

      userSelect.current.value = document.body.style.getPropertyValue(
        '-webkit-user-select',
      )
      userSelect.current.priority = document.body.style.getPropertyPriority(
        '-webkit-user-select',
      )

      document.body.style.setProperty(
        '-webkit-user-select',
        'none',
        'important',
      )
    }
  }

  const setEndCursor = () => {
    if (editorRootElement !== null) {
      editorRootElement.style.setProperty('cursor', 'text')
    }
    if (document.body !== null) {
      document.body.style.setProperty('cursor', 'default')
      document.body.style.setProperty(
        '-webkit-user-select',
        userSelect.current.value,
        userSelect.current.priority,
      )
    }
  }

  const handlePointerMove = (event: PointerEvent) => {
    const image = imageRef.current
    const positioning = positioningRef.current
    const isHorizontal = positioning.direction & (Direction.east | Direction.west)

    if (image !== null && positioning.isResizing) {
      const zoom = calculateZoomLevel(image)

      if (isHorizontal) {
        let diff = Math.floor(positioning.startX - event.clientX / zoom)
        diff = positioning.direction & Direction.east ? -diff : diff

        const width = clampNum(
          positioning.startWidth + diff,
          MIN_WIDTH,
          maxWidthContainer,
        )

        image.style.width = `${width}px`
        positioning.currentWidth = width
      }
    }
  }

  const handlePointerUp = () => {
    const positioning = positioningRef.current
    const controlWrapper = controlWrapperRef.current
    const image = imageRef.current

    if (image !== null && controlWrapper !== null && positioning.isResizing) {
      const width = positioning.currentWidth
      const height = positioning.currentHeight

      positioning.startWidth = 0
      positioning.startHeight = 0
      positioning.ratio = 0
      positioning.startX = 0
      positioning.startY = 0
      positioning.currentWidth = 0
      positioning.currentHeight = 0
      positioning.isResizing = false

      controlWrapper.style.removeProperty('touchAction')

      setEndCursor()
      props.onResizeEnd(width, height)

      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, direction: number) => {
    if (!editor.isEditable()) {
      return
    }

    const image = imageRef.current
    const positioning = positioningRef.current
    const controlWrapper = controlWrapperRef.current

    if (image !== null && controlWrapper !== null) {
      event.preventDefault()

      const { width, height } = image.getBoundingClientRect()
      const zoom = calculateZoomLevel(image)

      positioning.startWidth = width
      positioning.startHeight = height
      positioning.ratio = width / height
      positioning.currentWidth = width
      positioning.currentHeight = height
      positioning.startX = event.clientX / zoom
      positioning.startY = event.clientY / zoom
      positioning.isResizing = true
      positioning.direction = direction

      setStartCursor()
      props.onResizeStart()

      controlWrapper.style.touchAction = 'none'
      image.style.height = `${height}px`
      image.style.width = `${width}px`

      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
    }
  }

  return (
    <div className={csses.wrap} ref={controlWrapperRef}>
      <div
        className={csses.east}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.east)
        }}
      />
      <div
        className={csses.west}
        onPointerDown={(event) => {
          handlePointerDown(event, Direction.west)
        }}
      />
    </div>
  )
}

export default ImageResizer
