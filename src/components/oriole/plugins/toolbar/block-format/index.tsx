import React from 'react'
import { LexicalEditor } from 'lexical'
import { blockTypeToBlockName } from '../config'
import DropDown, { DropDownItem } from '~/ui/dropdown'
import {
  formatParagraph,
  formatHeading,
  formatNumberedList,
  formatBulletList,
  formatCheckList,
  formatCode,
  formatQuote,
} from '../utils'
import { SHORTCUTS } from '~/config'
import csses from './index.less'

interface Props {
  blockType: keyof typeof blockTypeToBlockName,
  editor: LexicalEditor,
  activeEditor: LexicalEditor,
  disabled?: boolean,
}

const BlockFormat = (porps: Props) => {
  const { blockType, editor, disabled, activeEditor } = porps

  if (!(blockType in blockTypeToBlockName) || activeEditor !== editor) {
    return null
  }

  return (
    <DropDown
      disabled={disabled}
      label={blockTypeToBlockName[blockType]}
    >
      <DropDownItem
        onClick={() => formatParagraph(editor)}
      >
        <span>Normal</span>
        <span>{SHORTCUTS.NORMAL}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => formatHeading(editor, blockType, 'h1')}
      >
        <span>Heading 1</span>
        <span>{SHORTCUTS.HEADING1}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => formatHeading(editor, blockType, 'h2')}
      >
        <span>Heading 2</span>
        <span>{SHORTCUTS.HEADING2}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => formatHeading(editor, blockType, 'h3')}
      >
        <span>Heading 3</span>
        <span>{SHORTCUTS.HEADING3}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => formatNumberedList(editor, blockType)}
      >
        <span>Numbered List</span>
        <span>{SHORTCUTS.NUMBERED_LIST}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => formatBulletList(editor, blockType)}
      >
        <span>Bullet List</span>
        <span>{SHORTCUTS.BULLET_LIST}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => formatCheckList(editor, blockType)}
      >
        <span className="text">Check List</span>
        <span className="shortcut">{SHORTCUTS.CHECK_LIST}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => formatQuote(editor, blockType)}
      >
        <span>Quote</span>
        <span>{SHORTCUTS.QUOTE}</span>
      </DropDownItem>
      <DropDownItem
        onClick={() => formatCode(editor, blockType)}
      >
        <span>Code Block</span>
        <span>{SHORTCUTS.CODE_BLOCK}</span>
      </DropDownItem>
    </DropDown>
  );
}

export default BlockFormat
