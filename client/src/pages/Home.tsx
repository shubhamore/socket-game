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

    socket.on('error', (message: string) => {
      alert(message); 
    });

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
    <div>
      <h1>Socket.io Room Management</h1>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Enter room ID"
      />
      <button onClick={handleCreateRoom}>Create Room</button>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default Home;
