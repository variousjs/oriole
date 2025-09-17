import { FC } from 'react'
import * as Buttons from './components'
import { ButtonActions, DropdownActions } from './types'

const map: Record<ButtonActions | DropdownActions, FC<Buttons.Props>> = {
  Bold: Buttons.Bold,
  Undo: Buttons.Undo,
  Redo: Buttons.Redo,
  Text: Buttons.Paragraph,
  H1: Buttons.H1,
  H2: Buttons.H2,
  H3: Buttons.H3,
  H4: Buttons.H4,
  H5: Buttons.H5,
  H6: Buttons.H6,
  NumberList: Buttons.NumberList,
  CheckList: Buttons.CheckList,
  BulletList: Buttons.BulletList,
  Quote: Buttons.Quote,
  Code: Buttons.Code,
  CodeBlock: Buttons.CodeBlock,
  Italic: Buttons.Italic,
  Underline: Buttons.Underline,
}

export default map
