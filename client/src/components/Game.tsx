import React, { useEffect, useState } from "react";
import { PlayerSign } from "../App";
import Cell from "./Cell";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";
import Modal from "./Modal";

type GameProps = {
  socket: Socket;
  playerSign: PlayerSign;
  setPlayerSign: React.Dispatch<React.SetStateAction<PlayerSign>>;
  handleLeaveRoom: () => void;
  roomId: string;
};

const Game: React.FC<GameProps> = ({
  socket,
  playerSign,
  setPlayerSign,
  handleLeaveRoom,
  roomId,
}) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [moveCount, setMoveCount] = useState(0);
  const [isPointer, setIsPointer] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState("");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setMoveCount(0);
    setGameOver(false);
    setResult("");
    setPlayerSign(playerSign === "X" ? "O" : "X");
  }

  const checkWin = (board: string[], playerSign: string): boolean => {
    return WINNING_COMBINATIONS.some((combination) =>
      combination.every((index) => board[index] === playerSign)
    );
  };

  const checkDraw = (board: string[]): boolean => {
    return (
      board.every((cell) => cell !== "") &&
      !checkWin(board, "X") &&
      !checkWin(board, "O")
    );
  };

  const handleMove = (index: number) => {
    if (gameOver) {
      toast.error("Game over");
      return;
    }
    if (!playerSign) return;
    if (board[index]) {
      toast.error("Invalid move");
      return;
    }

    const newBoard = [...board];
    newBoard[index] = playerSign || "";
    setBoard(newBoard);
    setMoveCount((c) => c + 1);

    const opponentSign = playerSign === "X" ? "O" : "X";

    if (checkWin(newBoard, playerSign)) {
      toast.success("You win!");
      setGameOver(true);
      setResult("You win!");
    } else if (checkWin(newBoard, opponentSign)) {
      toast.error("You lose!");
      setGameOver(true);
      setResult("You lose!");
    } else if (checkDraw(newBoard)) {
      toast.info("It's a draw!");
      setResult("It's a draw!");
      setGameOver(true);
    }

    socket.emit("move", { index, playerSign });
  };

  useEffect(() => {
    if (gameOver) return;

    const isXTurn = moveCount % 2 === 0 && playerSign === "X";
    const isOTurn = moveCount % 2 !== 0 && playerSign === "O";

    if (isXTurn || isOTurn) {
      setIsPlayerTurn(true);
    } else {
      setIsPlayerTurn(false);
    }
  }, [moveCount, playerSign, gameOver]);

  useEffect(() => {
    socket.on(
      "move",
      ({ index, playerSign }: { index: number; playerSign: PlayerSign }) => {
        const newBoard = [...board];
        newBoard[index] = playerSign || "";
        setBoard(newBoard);
        setMoveCount((c) => c + 1);

        const opponentSign = playerSign === "X" ? "O" : "X";

        if (checkWin(newBoard, playerSign || "")) {
          toast.success("You lose!");
          setGameOver(true);
          setResult("You lose!");
        } else if (checkWin(newBoard, opponentSign)) {
          toast.success("You win!");
          setGameOver(true);
          setResult("You win!");
        } else if (checkDraw(newBoard)) {
          toast.info("It's a draw!");
          setResult("It's a draw!");
          setGameOver(true);
        }
      }
    );
    socket.on("startNewGame", () => {
      resetGame();
    });

    return () => {
      socket.off("move");
      socket.off("startNewGame");
    };
  }, [board, playerSign, socket]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg">
        <div className="mb-4 text-xl font-bold">
          {gameOver
            ? result
            : isPlayerTurn
            ? `Your move (${playerSign})`
            : `Opponent's move`}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {board.map((cell, index) => (
            <Cell
              key={index}
              value={cell}
              onClick={() => handleMove(index)}
              isPointer={isPointer && !gameOver && isPlayerTurn}
            />
          ))}
        </div>
      </div>
      <Modal
        open={gameOver}
        setOpen={setGameOver}
        result={result}
        handleLeaveRoom={handleLeaveRoom}
        socket={socket}
        roomId={roomId}
        resetGame={resetGame}
      />
    </div>
  );
};

export default Game;
