import React, { Component } from 'react'
import { createComponent } from '@variousjs/various'
import csses from './container.less'

const Oriole = createComponent({ name: 'oriole' })

class Container extends Component {
  render() {
    return (
      <div className={csses.container}>
        <Oriole />
      </div>
    )
  }
}

export default Container
