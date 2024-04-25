'use client'

import VideoScreen from '@/app/components/VideoScreen';
import {useState, useRef, useEffect, useCallback} from 'react';
import Webcam from 'react-webcam';
import ReactPlayer from 'react-player'
import { SocketProvider, useSocket } from '../../../../context/SocketProvider';
import rtcConnection from '../../webRTC/rtcConnection';



export default function Home() {

  // ------------------- socket.io wala code saara ------------------------
  const socket = useSocket();

  //socket ID of the user entering by accepting the call
  const [userStream, setUserStream] = useState();
  const [userVideo, setUserVideo] = useState(false);
  const [secondUserVideo, setSecondUserVideo] = useState(false);
  const [remoteId, setRemoteId] = useState(null);

  const callClicked = useCallback( async () => {

      const offer = await rtcConnection.makeOffer();
      // console.log(offer);
      socket.emit( 'make-call', { to: remoteId, offer } )

  }, [remoteId, socket])

  
  //this useEffect is for the other users who are entering the room with the room code
  let video;
  useEffect( () => {

    video = navigator.mediaDevices.getUserMedia({ audio: true, video: false })

    setUserStream(video);
    

    socket.on( "user-joined", (data) => {

      const { username, socketId } = data;
      setRemoteId(socketId);
      console.log(data);
      //destructuring the incoming data
      // const { username, socketId } = data;
      //logging the details in the console ( this can be done on the screen toko )
      // console.log( ` ${username} joined the room with socket ID: ${socketId} ` );
      // console.log(data);
    } )

    socket.on( 'incoming-call', async ({from, offer}) => {
        console.log(offer);

        const remoteUserVideo = navigator.mediaDevices.getUserMedia({ audio:true, video:false })
        setUserStream(remoteUserVideo);

        const answer = await rtcConnection.makeAnswer(offer);

        socket.emit( 'call-accepted', { to: from, answer } );
    })

  }, [socket] ) //adding socket as a dependancy





  // ---------------- state and core react wala code ---------------------  

  const allowUserVideo = () => {
    setUserVideo(!userVideo);
    // if( userVideo ){
    //   setUserStream(video);
    // }
    // else{
    //   setUserVideo( null );
    // }
  }
  const allowSecondUserVideo = () => {
    setSecondUserVideo(!secondUserVideo);
  }

  return (
    <>

      <div className="h-full w-full flex flex-col justify-center items-center">

        <div className="h-screen w-full flex flex-row justify-center items-center">

            <div className="flex flex-col justify-center items-center bg-slate-950 h-[60%] w-[40%] rounded-xl mx-2 border-2 border-white" > 
              < VideoScreen audio={false} video={userVideo} />
            </div>

            { remoteId ? ( <div className="flex flex-col justify-center items-center bg-slate-950 h-[60%] w-[40%] rounded-xl mx-2 border-2 border-white" > 
              { secondUserVideo  ? ( < VideoScreen audio={false} video={secondUserVideo} /> ) : ( <></> ) }
            </div> ) : ( <></> ) }            

        </div> 

        <div className='flex justify-center items-center gap-x-5'>

          <button className='h-10 w-32 my-10 bg-blue-600 rounded-lg' onClick={callClicked}>Make Call</button>
          <button className=" my-8 h-9 w-32 text-white bg-purple-800 font-bold rounded-md" onClick={allowUserVideo}>Switch Video</button>    
          {/* <button className=" my-3 h-9 w-32 text-white bg-purple-800 font-bold rounded-md" onClick={allowSecondUserVideo}>Second User</button>   */}

        </div> 

      </div>
    
    </>
  );
}
