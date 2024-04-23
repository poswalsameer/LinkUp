'use client'

import {useState, useRef, useEffect} from 'react';
import Webcam from 'react-webcam';
import { useSocket } from '../../../../context/SocketProvider';



export default function Home() {

  // ------------------- socket.io wala code saara ------------------------
  const socket = useSocket();

  //this useEffect is for the other users who are entering the room with the room code
  useEffect( () => {

    socket.on( "user-joined", (data) => {

      //destructuring the incoming data
      const { username, socketId } = data;
      //logging the details in the console ( this can be done on the screen too )
      console.log( ` ${username} joined the room with socket ID: ${socketId} ` );
      // console.log(data);
    } )

  }, [socket] ) //adding socket as a dependancy




  // ---------------- state and core react wala code ---------------------
  const [userVideo, setUserVideo] = useState(false);
  const [secondUserVideo, setSecondUserVideo] = useState(false);  

  const allowUserVideo = () => {
    setUserVideo(!userVideo);
  }

  const allowSecondUserVideo = () => {
    setSecondUserVideo(!secondUserVideo);
  }

  //reference to the users
  const firstUserRef = useRef(null);
  const secondUserRef = useRef(null);


  // --------------- web rtc wala code saara --------------
  const servers = {
      iceServers: [
          {
              urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.google.com:19302']
          }
      ]
  };

  let newMemberJoined = async (memberID) => {
    console.log("A new user joined the channel:", memberID);
  }

  useEffect( () => {

    //RTC Peer connection is a constructor that gives various methods and also connects local to remote 
    let connection = new RTCPeerConnection(servers);
    // console.log(connection);

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('New ICE Candidate:', event.candidate);
      }
    };


    //adding tracks of the first user so that the second user can get the video and audio of the first user easily
    if (firstUserRef && firstUserRef.current) {
      
      //getting the video and audio tracks
      const tracks = firstUserRef.current.getVideoTracks();
      
      //looping through all the tracks and adding them
      tracks.forEach(track => {
          connection.addTrack(track, firstUserRef.current);
      });
    } 

    //adding the tracks of the second user
    connection.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => {
          secondUserRef.addTrack(track);
          console.log('second user');
      })
    }

    //creating an offer
    let firstOffer = connection.createOffer()
   
      .then( offer => {
        connection.setLocalDescription(firstOffer);
        console.log("Offer:", offer);
      } )
      .catch( error => {
        console.log( "error while logging the offer:", error ); 
      } )

    //passing the offer to the local description of the established connection
    

  }, [] )

  

  return (
    <>

      <div className="h-screen w-full flex flex-col justify-center items-center">

        <div className="h-screen w-full flex flex-row justify-center items-center">

            <div className="flex flex-col justify-center items-center bg-slate-950 h-[90%] w-[48%] rounded-xl mx-2 border-2 border-white" >

                { userVideo  ? ( <Webcam ref={firstUserRef} audio={false} videoConstraints={userVideo} className="h-full w-full rounded-xl"/> ) : ( <p className="font-extrabold text-3xl">Your Video is OFF</p> ) }

            </div>

            <div className="flex flex-col justify-center items-center bg-slate-950 h-[90%] w-[48%] rounded-xl mx-2 border-2 border-white" >

            { secondUserVideo  ? ( <Webcam ref={secondUserRef} audio={false} videoConstraints={secondUserVideo} className="h-full w-full rounded-xl"/> ) : ( <p className="font-extrabold text-3xl">Your Video is OFF</p> ) }

            </div>

        </div> 

        <button className=" my-8 h-9 w-32 text-white bg-purple-800 font-bold rounded-md" onClick={allowUserVideo}>First User</button>    

        <button className=" my-3 h-9 w-32 text-white bg-purple-800 font-bold rounded-md" onClick={allowSecondUserVideo}>Second User</button>   

      </div>
    
    </>
  );
}
