// src/socket.ts
import io, { Socket } from 'socket.io-client';

// Create a singleton instance of the socket
const socket: Socket = io('http://localhost:4000');

// Export the singleton instance
export default socket;
