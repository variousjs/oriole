import React, { MouseEvent } from 'react'
import DropDown, { DropDownItem } from '~/ui/dropdown'
import Button from '~/ui/button'
import * as ActionButtons from './components'
import * as Icons from '~/ui/icons'
import { ToolbarActions } from './types'
import { useToolbarState } from './context'
import csses from './index.less'

interface Props {
  actions: ToolbarActions
}

const blockMap = {
  bullet: 'BulletList',
  check: 'CheckList',
  code: 'CodeBlock',
  h1: 'H1',
  h2: 'H2',
  h3: 'H3',
  h4: 'H4',
  h5: 'H5',
  h6: 'H6',
  number: 'NumberList',
  paragraph: 'Paragraph',
  quote: 'Quote',
}

const alignMap = {
  left: 'LeftAlign',
  right: 'RightAlign',
  center: 'CenterAlign',
}

const ActionsMap = (props: Props) => {
  const { toolbarState } = useToolbarState()
  const { actions } = props

  const onDropDownItemClick = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.querySelector('button')?.click()
  }

  return (
    <div className={csses.toolbar}>
      {
        actions.map((action, i) => {
          if (typeof action === 'string') {
            if (action === '_Divider') {
              return (<div className={csses.divider} key={action + i} />)
            }

            const A = ActionButtons[action as 'Undo']
            if (A) {
              return <A key={action + i} />
            }
          }

          if (Array.isArray(action)) {
            return action.map((option, j) => {
              const { items, type } = option
              let CurrentIcon = <Icons.Format />

              if (type === 'block') {
                const iconName = blockMap[toolbarState.blockType] as 'Paragraph'
                const Icon = Icons[iconName]
                CurrentIcon = <Icon />
              }

              if (type === 'align') {
                const iconName = alignMap[toolbarState.elementFormat as 'left'] as 'LeftAlign'
                const Icon = Icons[iconName]
                CurrentIcon = <Icon />
              }

              return (
                <DropDown
                  key={type + j}
                  trigger={(
                    <Button
                      style={{ gap: 0 }}
                      prefix={CurrentIcon}
                      suffix={(
                        <Icons.Down style={{ zoom: .5, opacity: .7 }} />
                      )}
                    />
                  )}
                >
                  {
                    items.map((item, k) => {
                      const B = ActionButtons[item as 'Undo']

                      if (!B) {
                        return null
                      }

                      return (
                        <DropDownItem onClick={onDropDownItemClick} key={item + k}>
                          <B blockType="dropdown" />
                        </DropDownItem>
                      )
                    })
                  }
                </DropDown>
              )
            })
          }

          return null
        })
      }
    </div>
  )
}

export default ActionsMap
