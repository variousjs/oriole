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
import * as Icons from '~/ui/icons'
import Button from '~/ui/button'
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
    onClick?: () => void,
  }> = {
    h6: {
      icon: 'H6',
    },
    paragraph: {
      icon: 'Text',
      onClick: () => formatParagraph(editor),
    },
    h1: {
      icon: 'H1',
      onClick: () => formatHeading(editor, blockType, 'h1'),
    },
    h2: {
      icon: 'H2',
      onClick: () => formatHeading(editor, blockType, 'h2'),
    },
    h3: {
      icon: 'H3',
      onClick: () => formatHeading(editor, blockType, 'h3'),
    },
    h4: {
      icon: 'H4',
      onClick: () => formatHeading(editor, blockType, 'h4'),
    },
    h5: {
      icon: 'H5',
      onClick: () => formatHeading(editor, blockType, 'h5'),
    },
    number: {
      icon: 'NumberList',
      onClick: () => formatNumberedList(editor, blockType),
    },
    bullet: {
      icon: 'List',
      onClick: () => formatBulletList(editor, blockType),
    },
    check: {
      icon: 'CheckList',
      onClick: () => formatCheckList(editor, blockType),
    },
    quote: {
      icon: 'Quote',
      onClick: () => formatQuote(editor, blockType),
    },
    code: {
      icon: 'CodeBlock',
      onClick: () => formatCode(editor, blockType),
    },
  }

  const list = Object.keys(map) as Array<typeof blockType>
  const currentType = map[blockType]!
  const CurrentIcon = Icons[currentType.icon]

  return (
    <DropDown
      disabled={disabled}
      trigger={(
        <Button
          style={{ gap: 0 }}
          prefix={<CurrentIcon />}
          suffix={(
            <Icons.Down style={{ zoom: .5, opacity: .7 }} />
          )}
        />
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
            </DropDownItem>
          )
        })
      }
    </DropDown>
  );
}

export default BlockFormat
