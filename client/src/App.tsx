import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Home from "./pages/Home";
import Room from "./pages/Room";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket: Socket = io("http://localhost:4000");

export type PageState = "home" | "room";
export type PlayerSign = "X" | "O" | undefined;

const App: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>("home");
  const [roomId, setRoomId] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);
  const [playerSign, setPlayerSign] = useState<PlayerSign>();

  useEffect(() => {
    socket.on("message", (msg: string) => {
      toast.info(msg);
    });

    socket.on("updatePlayers", (players: string[]) => {
      setPlayers(players);
    });

    socket.on("error", (errorMsg: string) => {
      toast.error(errorMsg);
    });

    return () => {
      socket.off("message");
      socket.off("updatePlayers");
      socket.off("error");
    };
  }, []);

  return (
    <div>
      {pageState === "home" && (
        <Home
        setPageState={setPageState}
        socket={socket}
        roomId={roomId}
        setRoomId={setRoomId}
        setPlayerSign={setPlayerSign}
        />
      )}
      {pageState === "room" && (
        <Room
        setPageState={setPageState}
        socket={socket}
        roomId={roomId}
        players={players}
        playerSign={playerSign}
        setPlayerSign={setPlayerSign}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
