import React, { useEffect, useState } from 'react'
import { PlayerSign } from '../App';
import Cell from './Cell';
import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

type GameProps = {
    socket: Socket;
    playerSign: PlayerSign;
    setPlayerSign: React.Dispatch<React.SetStateAction<PlayerSign>>;
}

const Game: React.FC<GameProps> = ({socket,playerSign,setPlayerSign}) => {
    const [board, setBoard] = useState<string[]>(Array(9).fill(''))
    const [moveCount, setMoveCount] = useState(0)
    const [isPointer, setIsPointer] = useState(true)

    const handleMove = (index: number) => {
        if (!playerSign) return
        if (board[index]){
            toast.error('Invalid move')
            return
        }

        const newBoard = [...board]
        newBoard[index] = playerSign || ''
        setBoard(newBoard)
        setMoveCount(c=>c + 1)
        socket.emit('move', { index, playerSign })
    }

    useEffect(() => {
        if(moveCount%2===0&&playerSign==='X'){
            setIsPointer(true)
        }else if(moveCount%2!==0&&playerSign==='O'){
            setIsPointer(true)
        }
        else setIsPointer(false)
    },[moveCount,playerSign])

    useEffect(() => {
        socket.on('move', ({ index, playerSign }: { index: number; playerSign: PlayerSign }) => {
            const newBoard = [...board]
            newBoard[index] = playerSign || ''
            setBoard(newBoard)
            setMoveCount(c=>c + 1)
        })

        return () => {
            socket.off('move')
        }
    }, [board, playerSign, setPlayerSign, socket])

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center p-4 bg-white shadow-lg rounded-lg">
                <div className="grid grid-cols-3 gap-1">
                    {board.map((cell, index) => (
                        <Cell key={index} value={cell} onClick={() => handleMove(index)} isPointer={isPointer} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Game
