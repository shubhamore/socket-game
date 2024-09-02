import React, { useEffect, useState } from "react";
import { PlayerSign } from "../App";
import Cell from "./Cell";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

type GameProps = {
  socket: Socket;
  playerSign: PlayerSign;
  setPlayerSign: React.Dispatch<React.SetStateAction<PlayerSign>>;
};

const Game: React.FC<GameProps> = ({ socket, playerSign, setPlayerSign }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [moveCount, setMoveCount] = useState(0);
  const [isPointer, setIsPointer] = useState(true);
  const [gameOver, setGameOver] = useState(false);
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

  const checkWin = (board: string[], playerSign: string): boolean => {
    return WINNING_COMBINATIONS.some(combination => 
      combination.every(index => board[index] === playerSign)
    );
  };

  const checkDraw = (board: string[]): boolean => {
    return board.every(cell => cell !== '') && !checkWin(board, 'X') && !checkWin(board, 'O');
  };
  

  const handleMove = (index: number) => {
    if(gameOver) {
        toast.error('Game over');
        return;
    }
    if (!playerSign) return;
    if (board[index]) {
      toast.error('Invalid move');
      return;
    }
  
    const newBoard = [...board];
    newBoard[index] = playerSign || '';
    setBoard(newBoard);
    setMoveCount(c => c + 1);
  
    if (checkWin(newBoard, playerSign)) {
      toast.success(`${playerSign} wins!`);
      setGameOver(true);
    } else if (checkDraw(newBoard)) {
      toast.info('It\'s a draw!');
      setGameOver(true);
    }
    socket.emit('move', { index, playerSign });
  };
  

  useEffect(() => {
    if (moveCount % 2 === 0 && playerSign === "X") {
      setIsPointer(true);
    } else if (moveCount % 2 !== 0 && playerSign === "O") {
      setIsPointer(true);
    } else setIsPointer(false);
  }, [moveCount, playerSign]);

  useEffect(() => {
    socket.on('move', ({ index, playerSign }: { index: number; playerSign: PlayerSign }) => {
      const newBoard = [...board];
      newBoard[index] = playerSign || '';
      setBoard(newBoard);
      setMoveCount(c => c + 1);
  
      if (checkWin(newBoard, playerSign|| '')) {
        toast.success(`${playerSign} wins!`);
        setGameOver(true);
      } else if (checkDraw(newBoard)) {
        toast.info('It\'s a draw!');
        setGameOver(true);
      }
    });
  
    return () => {
      socket.off('move');
    };
  }, [board, playerSign, socket]);
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-3 gap-1">
          {board.map((cell, index) => (
            <Cell
              key={index}
              value={cell}
              onClick={() => handleMove(index)}
              isPointer={isPointer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
