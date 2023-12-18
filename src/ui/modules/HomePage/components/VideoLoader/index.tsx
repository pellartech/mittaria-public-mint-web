import { useState, useEffect, useRef } from 'react'

const assets = {
  videos: [
    '/videos/VDO_T2_02.webm',
    '/videos/VDO_T2_03.webm',
    '/videos/VDO_T4_02.webm',
    '/videos/VDO_T1_01.webm',
    '/videos/VDO_T3_02.webm',
    '/videos/VDO_T5_01.webm'
  ],
  images: [
    '/images/connect_wallet.png',
    '/images/eligible.png',
    '/images/loading.png',
    '/images/not_eligible.png'
  ]
}

interface VideoLoaderProps {
  onLoaded: () => void
}

const VideoLoader = ({ onLoaded }: VideoLoaderProps) => {
  const [loadedCount, setLoadedCount] = useState(0)
  const videoRefs = useRef<HTMLVideoElement[]>([])
  const imageRefs = useRef<HTMLImageElement[]>([])

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      video.load()
    })
    setTimeout(() => {
      onLoaded()
    }, 3500)
  }, [])

  useEffect(() => {
    imageRefs.current.forEach((img) => {
      if (img && !img.complete) {
        img.onload = handleAssetLoad
      } else {
        handleAssetLoad()
      }
    })
  }, [])

  useEffect(() => {
    console.log('loaded')
    if (loadedCount === assets.videos.length + assets.images.length) {
      onLoaded()
    }
  }, [loadedCount])

  const handleAssetLoad = () => {
    setLoadedCount((prev) => prev + 1)
  }

  return (
    <div style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}>
      {assets.videos.map((asset, index) => (
        <video
          key={index}
          ref={(el) => {
            if (el) {
              videoRefs.current[index] = el
            }
          }}
          onLoadedData={handleAssetLoad}
        >
          <source src={asset} type='video/webm' />
        </video>
      ))}

      {assets.images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt=''
          ref={(el) => {
            if (el) {
              imageRefs.current[index] = el
            }
          }}
        />
      ))}
    </div>
  )
}

export default VideoLoader
