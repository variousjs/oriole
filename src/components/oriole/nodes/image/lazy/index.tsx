import React, { RefObject, useEffect, useState } from 'react'
import BrokenImage from '~/ui/broken-image'
import csses from './index.less'

const SVG_DEFAULT_WIDTH = 200
const SVG_DEFAULT_HEIGHT = SVG_DEFAULT_WIDTH

interface Props {
  altText?: string,
  height: 'inherit' | number,
  imageRef: RefObject<HTMLImageElement>,
  maxWidth?: number,
  src: string,
  width: 'inherit' | number,
  onError: () => void,
  isFocused?: boolean,
  isDraggable?: boolean,
}

function isSVG(src: string) {
  return src.toLowerCase().endsWith('.svg')
}

const imageCache = new Map<string, Promise<boolean> | boolean>()

function useSuspenseImage(src: string) {
  let cached = imageCache.get(src)

  if (typeof cached === 'boolean') {
    return cached
  }

  if (!cached) {
    cached = new Promise<boolean>((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve(false)
      img.onerror = () => resolve(true)
    }).then((hasError) => {
      imageCache.set(src, hasError)
      return hasError
    })
    imageCache.set(src, cached)
    throw cached
  }
  throw cached
}

const LazyImage = (props: Props) => {
  const {
    src,
    imageRef,
    maxWidth,
    height,
    width,
    altText,
    isDraggable,
    isFocused,
  } = props

  const [dimensions, setDimensions] = useState<{
    width: number,
    height: number,
  } | null>(null)
  const isSVGImage = isSVG(src)
  const hasError = useSuspenseImage(src)

  useEffect(() => {
    if (imageRef.current && isSVGImage) {
      const { naturalWidth, naturalHeight } = imageRef.current
      setDimensions({
        height: naturalHeight,
        width: naturalWidth,
      })
    }
  }, [imageRef, isSVGImage])

  useEffect(() => {
    if (hasError) {
      props.onError()
    }
  }, [hasError, props.onError])

  if (hasError) {
    return (<BrokenImage />)
  }

  const calculateDimensions = () => {
    if (!isSVGImage) {
      return { height, maxWidth, width }
    }

    const naturalWidth = dimensions?.width || SVG_DEFAULT_WIDTH
    const naturalHeight = dimensions?.height || SVG_DEFAULT_HEIGHT

    let finalWidth = naturalWidth
    let finalHeight = naturalHeight

    if (maxWidth && finalWidth > maxWidth) {
      const scale = maxWidth / finalWidth
      finalWidth = maxWidth
      finalHeight = Math.round(finalHeight * scale)
    }

    return {
      height: finalHeight,
      maxWidth,
      width: finalWidth,
    }
  }

  const imageStyle = calculateDimensions()

  return (
    <img
      className={[
        isDraggable && `${csses.draggable} draggable`,
        isFocused && `${csses.focused} focused`
      ].filter(Boolean).join(' ')}
      src={src}
      alt={altText}
      ref={imageRef}
      style={imageStyle}
      onError={props.onError}
      draggable="false"
      onLoad={(e) => {
        if (isSVGImage) {
          const img = e.currentTarget
          setDimensions({
            height: img.naturalHeight,
            width: img.naturalWidth,
          })
        }
      }}
    />
  )
}

export default LazyImage
