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

    // socket.on('error', (message: string) => {
    //   alert(message); 
    // });

    return () => {
      socket.off('createRoomSuccess');
      socket.off('joinRoomSuccess');
      socket.off('error');
    };
  }, [socket, setPageState]);

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
        <h1 className='text-xl font-bold m-5'>Welcome to Real time Tic-Tac-Toe</h1>
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
      </div>
    </div>
  );
};

export default Home;
