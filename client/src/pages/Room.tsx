import React from "react";
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
      {players.length === 2 ? (
        <div>
          <Game socket={socket} playerSign={playerSign} setPlayerSign={setPlayerSign} handleLeaveRoom={handleLeaveRoom} roomId={roomId} />
        </div>
      ) : (
        <div className='flex justify-center items-center text-center h-screen'>
          <div className='flex bg-slate-200 flex-col p-10 h-fit rounded-lg max-w-[90%] min-w-screen-lg text-3xl items-center'>
            <h2 className="mb-3">RoomId: {roomId}</h2>
            <h2>Waiting for another player to join...</h2>
            <button className="border border-black inline-block w-fit text-2xl px-4 py-2 font-normal rounded-md mt-5" onClick={handleLeaveRoom}>Leave Room</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
