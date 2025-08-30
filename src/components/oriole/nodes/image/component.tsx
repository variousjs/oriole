import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  LexicalEditor,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { mergeRegister } from '@lexical/utils'
import BrokenImage from '~/ui/broken-image'
import LazyImage from './lazy'
import ImageResizer from './image-resizer'

interface Props {
  altText?: string,
  title?: string,
  width: 'inherit' | number,
  height: 'inherit' | number,
  maxWidth?: number,
  nodeKey: NodeKey,
  resizable?: boolean,
  src: string,
}

const ImageComponent = (props: Props) => {
  const {
    nodeKey,
    resizable = true,
    src,
    altText,
    width,
    height,
    maxWidth,
  } = props

  const imageRef = useRef<null | HTMLImageElement>(null)
  const activeEditorRef = useRef<LexicalEditor | null>(null)

  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [selection, setSelection] = useState<BaseSelection | null>(null)
  const [isLoadError, setIsLoadError] = useState<boolean>(false);

  const [editor] = useLexicalComposerContext()
  const isEditable = useLexicalEditable()
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)

  const draggable = isSelected && $isNodeSelection(selection) && !isResizing
  const isFocused = (isSelected || isResizing) && isEditable

  const onClick = useCallback((event: MouseEvent) => {
    if (isResizing) {
      return true
    }

    if (event.target === imageRef.current) {
      if (event.shiftKey) {
        setSelected(!isSelected)
      } else {
        clearSelection()
        setSelected(true)
      }
      return true
    }

    return false
  },[isResizing, isSelected, setSelected, clearSelection])

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        const updatedSelection = editorState.read(() => $getSelection())
        if ($isNodeSelection(updatedSelection)) {
          setSelection(updatedSelection)
        } else {
          setSelection(null)
        }
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )

    return unregister
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    onClick,
    setSelected,
  ])

  const onResizeEnd = (
    nextWidth: 'inherit' | number,
    nextHeight: 'inherit' | number,
  ) => {
    setTimeout(() => {
      setIsResizing(false)
    }, 200)

    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight)
      }
    })
  }

  const onResizeStart = () => {
    setIsResizing(true)
  }

  return (
    <>
      <div draggable={draggable}>
        {isLoadError ? (
          <BrokenImage />
        ) : (
          <LazyImage
            isDraggable={$isNodeSelection(selection)}
            isFocused
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            maxWidth={maxWidth}
            onError={() => setIsLoadError(true)}
          />
        )}
      </div>

      {resizable && $isNodeSelection(selection) && isFocused && (
        <ImageResizer
          editor={editor}
          imageRef={imageRef}
          maxWidth={maxWidth}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      )}
    </>
  );
}

export default ImageComponent
