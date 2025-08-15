import React from 'react'
import { ErrorNode } from '@variousjs/various'
import { Store } from '../../types'

const errorComponent: ErrorNode<Store> = ({ $reload, $error }) => (
  <>
    <h3>{`[${$error.type}]: ${$error.message || '组件错误'}`}</h3>
    {
      $reload && <button onClick={$reload}>刷新</button>
    }
  </>
)

export default errorComponent
