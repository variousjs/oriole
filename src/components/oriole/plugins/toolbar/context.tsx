import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ElementFormatType } from 'lexical'
import { blockTypeToBlockName, DEFAULT_FONT_SIZE, rootTypeToRootName } from './config'

const INITIAL_TOOLBAR_STATE = {
  bgColor: '#fff',
  blockType: 'paragraph' as keyof typeof blockTypeToBlockName,
  canRedo: false,
  canUndo: false,
  codeLanguage: '',
  codeTheme: '',
  elementFormat: 'left' as ElementFormatType,
  fontColor: '#000',
  fontFamily: 'Arial',
  fontSize: `${DEFAULT_FONT_SIZE}px`,
  fontSizeInputValue: `${DEFAULT_FONT_SIZE}`,
  isBold: false,
  isCode: false,
  isHighlight: false,
  isImageCaption: false,
  isItalic: false,
  isLink: false,
  isRTL: false,
  isStrikethrough: false,
  isSubscript: false,
  isSuperscript: false,
  isUnderline: false,
  isLowercase: false,
  isUppercase: false,
  isCapitalize: false,
  rootType: 'root' as keyof typeof rootTypeToRootName,
  listStartNumber: undefined as number | undefined,
}
type ToolbarState = typeof INITIAL_TOOLBAR_STATE
type ToolbarStateKey = keyof ToolbarState
type ToolbarStateValue<Key extends ToolbarStateKey> = ToolbarState[Key]

interface ContextShape {
  toolbarState: ToolbarState,
  updateToolbarState<Key extends ToolbarStateKey>(
    key: Key,
    value: ToolbarStateValue<Key>,
  ): void,
}

const Context = createContext<ContextShape | null>(null)

export const ToolbarProvider = (props: { children: ReactNode }) => {
  const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBAR_STATE)
  const selectionFontSize = toolbarState.fontSize

  const updateToolbarState = useCallback(
    <Key extends ToolbarStateKey>(key: Key, value: ToolbarStateValue<Key>) => {
      setToolbarState((prev) => ({
        ...prev,
        [key]: value,
      }))
    },[])

  useEffect(() => {
    updateToolbarState('fontSizeInputValue', selectionFontSize.slice(0, -2));
  }, [selectionFontSize, updateToolbarState]);

  const contextValue = useMemo(() => {
    return {
      toolbarState,
      updateToolbarState,
    };
  }, [toolbarState, updateToolbarState]);

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  )
}

export const useToolbarState = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useToolbarState must be used within a ToolbarProvider')
  }

  return context!
}
