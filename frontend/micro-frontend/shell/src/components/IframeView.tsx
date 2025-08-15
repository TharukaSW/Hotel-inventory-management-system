import React from 'react'

type Props = {
  src: string
  title: string
}

export default function IframeView({ src, title }: Props) {
  return (
    <iframe
      className="shell-iframe"
      src={src}
      title={title}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
    />
  )
}
