'use client'

import React, { useRef } from 'react'
import Webcam from 'react-webcam';
import ReactPlayer from 'react-player'

function VideoScreen(props) {
  return (
    // <div className="flex flex-col justify-center items-center bg-slate-950 h-[60%] w-[40%] rounded-xl mx-2 border-2 border-white" >

        <Webcam audio={props.audio} videoConstraints={props.video} className="h-full w-full rounded-xl"/> 
        // <ReactPlayer playing muted height="100px" width="200px" url={props.url} />
    // </div>


)
}

export default VideoScreen
