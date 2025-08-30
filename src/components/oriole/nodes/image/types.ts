import { NodeKey, SerializedLexicalNode, Spread } from 'lexical'

export interface ImagePayload {
  altText?: string,
  height?: number,
  key?: NodeKey,
  maxWidth?: number,
  src: string,
  width?: number,
}

export type SerializedImageNode = Spread<
  {
    altText?: string,
    height?: number,
    maxWidth: number,
    src: string;
    width?: number,
  },
  SerializedLexicalNode
>
