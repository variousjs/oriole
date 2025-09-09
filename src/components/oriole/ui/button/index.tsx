import React, { ReactNode } from 'react'
import { joinClasses } from '~/utils'
import csses from './index.less'

interface Props {
  children?: ReactNode,
  disabled?: boolean,
  onClick?: () => void,
  className?: string,
  title?: string,
  prefix?: ReactNode,
  suffix?: ReactNode,
}

const Button = (props: Props) => {
  return (
    <div className={csses.wrap}>
      <button
        disabled={props.disabled}
        className={joinClasses(
          csses.button,
          props.disabled && csses.disabled,
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
