import React from 'react'

const Mirai_Grace = () => {
  return (
    <div className="bg-white text-black w-full min-h-screen overflow-hidden relative flex items-center justify-center">
      <video
        src="/highlight.mp4"
        className="w-full h-auto max-h-screen object-contain"
        autoPlay
        loop
        muted
        playsInline
        aria-label="Highlight video"
      />
    </div>
  )
}

export default Mirai_Grace
