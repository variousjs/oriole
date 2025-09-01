import React, { ReactNode } from 'react'
import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMConversionMap,
  LexicalNode,
  LexicalUpdateJSON,
} from 'lexical'
import { THEME_PREFIX } from '~/config'
import { ImagePayload, SerializedImageNode } from './types'
import ImageComponent from './component'

export function $createImageNode(params: ImagePayload) {
  return $applyNodeReplacement(new ImageNode(params))
}

export function $isImageNode(node: LexicalNode | null | undefined) {
  return node instanceof ImageNode;
}

export const subImageClassName = '__image'

function $convertImageElement(domNode: Node) {
  const img = domNode as HTMLImageElement

  if (img.src.startsWith('file:///')) {
    return null
  }

  const { alt: altText, src, width, height } = img
  const node = $createImageNode({ altText, height, src, width })

  return { node }
}

class ImageNode extends DecoratorNode<ReactNode> {
  __src: string
  __altText?: string
  __width: 'inherit' | number
  __height: 'inherit' | number
  __maxWidth?: number

  static getType() {
    return 'image'
  }

  static clone(node: ImageNode) {
    return new ImageNode({
      src: node.__src,
      altText: node.__altText,
      maxWidth: node.__maxWidth,
      width: node.__width as number,
      height: node.__height as number,
      key: node.__key,
    })
  }

  static importJSON(serializedNode: SerializedImageNode) {
    const { altText, height, width, maxWidth, src } = serializedNode
    return $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    }).updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>) {
    const node = super.updateFromJSON(serializedNode)
    return node
  }

  exportDOM() {
    const element = document.createElement('img')

    element.setAttribute('src', this.__src)
    element.setAttribute('width', this.__width.toString())
    element.setAttribute('height', this.__height.toString())

    if (this.__altText) {
      element.setAttribute('alt', this.__altText)
    }

    return {element}
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
    }
  }

  constructor(params: ImagePayload) {
    super(params.key)

    this.__src = params.src
    this.__altText = params.altText
    this.__maxWidth = params.maxWidth
    this.__width = params.width || 'inherit'
    this.__height = params.height || 'inherit'
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth as number,
      src: this.getSrc(),
      width: this.__width === 'inherit' ? 0 : this.__width,
    }
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ) {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  createDOM() {
    const div = document.createElement('div')
    const className = THEME_PREFIX + subImageClassName
    if (className !== undefined) {
      div.className = className
      div.style.display = 'inline-block'
    }
    return div
  }

  updateDOM() {
    return false
  }

  getSrc() {
    return this.__src
  }

  getAltText() {
    return this.__altText
  }

  decorate() {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        resizable
      />
    );
  }
}

export default ImageNode
