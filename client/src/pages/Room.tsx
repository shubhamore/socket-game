import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { PageState } from '../App';

type RoomProps = {
  setPageState: React.Dispatch<React.SetStateAction<PageState>>;
  socket: Socket;
  roomId: string;
  players: string[];
};

const Room: React.FC<RoomProps> = ({setPageState,socket,roomId,players}) => {
  const handleLeaveRoom = () => {
    if (roomId.trim()) {
      socket.emit("leaveRoom", roomId);
      setPageState("home");
    }
  };

  return (
    <div>
      <div>
        <h2>Players in Room:</h2>
        <ul>
          {players.map((player) => (
            <li key={player}>{player}</li>
          ))}
        </ul>
        <button onClick={handleLeaveRoom}>Leave Room</button>

      </div>
    </div>
  );
};

export default Room;
