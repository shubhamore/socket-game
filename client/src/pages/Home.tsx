import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { PageState, PlayerSign } from '../App';

type HomeProps = {
  setPageState: React.Dispatch<React.SetStateAction<PageState>>;
  socket: Socket;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  roomId: string;
  setPlayerSign: React.Dispatch<React.SetStateAction<PlayerSign>>;
};

const Home: React.FC<HomeProps> = ({ setPageState, socket, roomId, setRoomId, setPlayerSign }) => {
  const [serverStatus, setServerStatus] = useState<string>('Spinning up the server, please wait...');
  const [isServerUp, setIsServerUp] = useState<boolean>(false);

  const checkStatus = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL||'http://localhost:4000/');
      if (response.ok) {
        setServerStatus('Server is up and running');
        setIsServerUp(true);  
      } else {
        setServerStatus('Server is not responding, please try again later');
      }
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    if (isServerUp) {
      return; 
    }

    const intervalId = setInterval(() => {
      checkStatus();
    }, 3000); 

    
    return () => {
      clearInterval(intervalId);
    };
  }, [isServerUp]); 

  useEffect(() => {
    socket.on('createRoomSuccess', () => {
      console.log("Room created successfully");
      setPlayerSign("X");
      setPageState("room");
    });

    socket.on('joinRoomSuccess', () => {
      console.log("Room joined successfully");
      setPlayerSign("O");
      setPageState("room");
    });

    return () => {
      socket.off('createRoomSuccess');
      socket.off('joinRoomSuccess');
    };
  }, [socket, setPageState, setPlayerSign]);

  const handleCreateRoom = () => {
    if (roomId.trim()) {
      socket.emit('createRoom', roomId);
    }
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      socket.emit('joinRoom', roomId);
    }
  };

  return (
    <div className='flex justify-center items-center text-center h-screen'>
      <div className='flex bg-slate-200 flex-col px-3 py-5 h-fit rounded-lg max-w-[90%] min-w-screen-lg'>
        <h1 className='text-xl font-bold m-5'>Welcome to Real-time Tic-Tac-Toe</h1>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          className='p-2 mx-2 my-4 rounded-md border border-black'
        />
        <div className='flex justify-evenly'>
          <button className='border p-2 border-black rounded-md' onClick={handleCreateRoom}>Create Room</button>
          <button className='border p-2 border-black rounded-md' onClick={handleJoinRoom}>Join Room</button>
        </div>
        {serverStatus && (
          <div className={`mt-4 p-2 ${serverStatus.includes('please') ? 'text-red-500' : 'text-green-500'}`}>
            {serverStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
