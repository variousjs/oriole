import React from 'react'
import { LexicalComposer, InitialConfigType } from '@lexical/react/LexicalComposer'

const Oriole = () => {
  const initialConfig: InitialConfigType = {
    namespace: 'oriole',
    onError(e) {
      console.error(e)
    }
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      a
    </LexicalComposer>
  )
}

export default Oriole
