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
import * as Icons from '~/ui/icons'
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

  const map: Record<typeof blockType, undefined | {
    icon: keyof typeof Icons,
    shortcut?: string,
    onClick?: () => void,
  }> = {
    h6: {
      icon: 'H6',
    },
    paragraph: {
      icon: 'Text',
      shortcut: SHORTCUTS.NORMAL,
      onClick: () => formatParagraph(editor),
    },
    h1: {
      icon: 'H1',
      shortcut: SHORTCUTS.HEADING1,
      onClick: () => formatHeading(editor, blockType, 'h1'),
    },
    h2: {
      icon: 'H2',
      shortcut: SHORTCUTS.HEADING2,
      onClick: () => formatHeading(editor, blockType, 'h2'),
    },
    h3: {
      icon: 'H3',
      shortcut: SHORTCUTS.HEADING3,
      onClick: () => formatHeading(editor, blockType, 'h3'),
    },
    h4: {
      icon: 'H4',
      shortcut: SHORTCUTS.HEADING4,
      onClick: () => formatHeading(editor, blockType, 'h4'),
    },
    h5: {
      icon: 'H5',
      shortcut: SHORTCUTS.HEADING5,
      onClick: () => formatHeading(editor, blockType, 'h5'),
    },
    number: {
      icon: 'NumberList',
      shortcut: SHORTCUTS.NUMBERED_LIST,
      onClick: () => formatNumberedList(editor, blockType),
    },
    bullet: {
      icon: 'List',
      shortcut: SHORTCUTS.BULLET_LIST,
      onClick: () => formatBulletList(editor, blockType),
    },
    check: {
      icon: 'CheckList',
      shortcut: SHORTCUTS.CHECK_LIST,
      onClick: () => formatCheckList(editor, blockType),
    },
    quote: {
      icon: 'Quote',
      shortcut: SHORTCUTS.QUOTE,
      onClick: () => formatQuote(editor, blockType),
    },
    code: {
      icon: 'Code',
      shortcut: SHORTCUTS.CODE_BLOCK,
      onClick: () => formatCode(editor, blockType),
    },
  }

  const list = Object.keys(map) as Array<typeof blockType>
  const currentType = map[blockType]!
  const CurrentIcon = Icons[currentType.icon]

  return (
    <DropDown
      disabled={disabled}
      label={(
        <div className={csses.name}>
          <CurrentIcon />{blockTypeToBlockName[blockType]}
        </div>
      )}
      value={blockType}
    >
      {
        list.map((type) => {
          const config = map[type]

          if (!config?.onClick) {
            return null
          }

          const Icon = Icons[config.icon]

          return (
            <DropDownItem
              key={type}
              onClick={config.onClick}
              value={type}
            >
              <span className={csses.name}><Icon />{blockTypeToBlockName[type]}</span>
              <span className={csses.shortcut}>{config.shortcut}</span>
            </DropDownItem>
          )
        })
      }
    </DropDown>
  );
}

export default BlockFormat
