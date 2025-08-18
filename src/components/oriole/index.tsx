import React from 'react'
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer'
import theme from './themes/default'
import nodes from './nodes'
import Editor from './editor'

const Oriole = () => {
  const initialConfig: InitialConfigType = {
    namespace: 'oriole',
    onError(e) {
      console.error(e)
    },
    theme,
    nodes,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Editor />
    </LexicalComposer>
  )
}

export default Oriole
