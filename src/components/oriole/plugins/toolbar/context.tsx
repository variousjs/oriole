import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ElementFormatType, LexicalEditor } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
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
  activeEditor: LexicalEditor,
  setActiveEditor: Dispatch<SetStateAction<LexicalEditor>>,
  updateToolbarState<Key extends ToolbarStateKey>(
    key: Key,
    value: ToolbarStateValue<Key>,
  ): void,
}

const Context = createContext<ContextShape | null>(null)

export const ToolbarProvider = (props: { children: ReactNode }) => {
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
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
    updateToolbarState('fontSizeInputValue', selectionFontSize.slice(0, -2))
  }, [selectionFontSize, updateToolbarState])

  const contextValue = useMemo(() => {
    return {
      toolbarState,
      updateToolbarState,
      activeEditor,
      setActiveEditor,
    };
  }, [toolbarState, updateToolbarState, activeEditor, setActiveEditor])

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
