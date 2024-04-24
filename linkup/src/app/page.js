'use client'

import Image from "next/image";
import { useState } from "react";
import { io } from "socket.io-client";
import { useSocket } from "../../context/SocketProvider";
import Link from "next/link";



export default function Home({router}) {

  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');

  // const router = useRouter();

  const socket = useSocket();


  const joinClicked = () => {

    if( username === '' ){
      alert('Username is required');
    } else{
      console.log( "Username entered: ", username );
    }

    if( roomId === '' ){
      alert('Room is required');
    } else{
      console.log("Room ID entered: ", roomId);
    }

    if( username !== '' && roomId !== '' ){
      socket.emit('join-room', { username, roomId } )
    } else{
      console.log("Fields were empty");
    }


    //whenever a user click this join room button, a new socket is created, the user is that socket
    //since frontend and backend are both on different port, hence using this import
    // const socket = io("http://localhost:3000");
    // console.log("button clicked");

    //this syntax is used to send(emit) message to the server, event handler is 'sendMessage' the name can by anything and the input state is passed as the message and then logged to the console
    // socket.emit('sendMessage', input);
    // console.log(input);
  }

  return (
    <div className='h-screen w-full flex flex-col justify-center items-center '>
        

        <h1 className='text-8xl my-10'>CLEAR TALK</h1>

        <div className='flex flex-col justify-center items-center my-7'>
          <p className='text-xl font-bold my-2'>Enter Username</p>
          <input type="text" name="" id="" className='h-12 w-72 p-3 bg-white border-4 border-blue-600 rounded-lg text-black text-lg font-bold focus:outline-none' value={username} 
          onChange = { (e) => setUsername(e.target.value) }
          />
        </div>

        <div className='flex flex-col justify-center items-center my-7'>
          <p className='text-xl font-bold my-2'>Enter Room ID</p>
          <input type="number" name="" id="" className='h-12 w-72 p-3 bg-white border-4 border-blue-600 rounded-lg text-black text-lg font-bold focus:outline-none' value={roomId}
          onChange = { (e) => setRoomId(e.target.value) }
          />
        </div>

        <button className='h-10 w-32 my-10 bg-blue-600 rounded-lg' 
        onClick={joinClicked}
        >
          <Link href={`/room/${roomId}`}>Join Room</Link>
        </button>

    </div>
  );
}
