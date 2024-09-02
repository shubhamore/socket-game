import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { PageState, PlayerSign } from "../App";
import Game from "../components/Game";

type RoomProps = {
  setPageState: React.Dispatch<React.SetStateAction<PageState>>;
  socket: Socket;
  roomId: string;
  players: string[];
  playerSign: PlayerSign;
  setPlayerSign: React.Dispatch<React.SetStateAction<PlayerSign>>;
};

const Room: React.FC<RoomProps> = ({
  setPageState,
  socket,
  roomId,
  players,
  playerSign,
  setPlayerSign,
}) => {
  const handleLeaveRoom = () => {
    if (roomId.trim()) {
      socket.emit("leaveRoom", roomId);
      setPageState("home");
    }
  };

  return (
    <div>
      <button onClick={handleLeaveRoom}>Leave Room</button>
      {players.length === 2 ? (
        <div>
          <Game socket={socket} playerSign={playerSign} setPlayerSign={setPlayerSign} />
        </div>
      ) : (
        <div>
          <h2>Waiting for another player to join...</h2>
          <h2>RoomId:{roomId}</h2>
        </div>
      )}
    </div>
  );
};

export default Room;
