import React, { ReactNode, CSSProperties } from 'react'
import { joinClasses } from '~/utils'
import csses from './index.less'

interface Props {
  style?: CSSProperties,
  children?: ReactNode,
  disabled?: boolean,
  onClick?: () => void,
  className?: string,
  title?: string,
  prefix?: ReactNode,
  suffix?: ReactNode,
  active?: boolean,
  block?: boolean,
}

const Button = (props: Props) => {
  return (
    <div className={csses.wrap}>
      <button
        style={props.style}
        disabled={props.disabled}
        className={joinClasses(
          csses.button,
          props.disabled && csses.disabled,
          props.active && csses.active,
          props.block && csses.block,
          props.className,
        )}
        onClick={props.onClick}
      >
        {props.prefix}
        {props.children}
        {props.suffix}
      </button>
      {
        !props.disabled && props.title ? (
          <div className={csses.tooltip}>
            {props.title}
          </div>
        ) : null
      }
    </div>
  )
}

export default Button
