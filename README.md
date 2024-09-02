# Tic-Tac-Toe Game

Welcome to the Tic-Tac-Toe Game! This project allows users to create and join rooms to play a classic game of Tic-Tac-Toe.

## Live Demo

Experience the Tic-Tac-Toe game in action! Click [here](https://tic-tac-toe-shubham.onrender.com/) to try out the live demo and play the game with friends.

## Features

- Create and join rooms to play Tic-Tac-Toe with friends.
- Real-time updates using Socket.IO.
- Responsive and modern UI with Tailwind CSS.
- Type safety with TypeScript for both frontend and backend.

## Tech Stack

- **Frontend**: React, Tailwind CSS, TypeScript
- **Backend**: Express, Socket.IO, TypeScript

## Prerequisites

### Option 1: Docker and Docker Compose

- **Docker**: [Installation Instructions](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Installation Instructions](https://docs.docker.com/compose/install/)

### Option 2: Node.js and npm

- **Node.js**: [Download and Install](https://nodejs.org/)
- **npm**: npm is included with Node.js.

## Installation

### Using Docker

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/shubhamore/tic-tac-toe.git
    cd tic-tac-toe
    ```

2. **Build and Start Containers:**

    To build and start both the frontend and backend containers, run:

    ```bash
    docker-compose up --build
    ```

    This command will build Docker images for the frontend and backend services and start them.

3. **Access the Application:**

    Once the containers are up and running, open your browser and navigate to `http://localhost:5173` to access the Tic-Tac-Toe game.

4. **Stop Containers:**

    To stop and remove the containers, run:

    ```bash
    docker-compose down
    ```

### Without Docker

If you prefer to run the application without Docker, follow these steps:

#### Frontend Setup

1. Navigate to the `client` directory:

    ```bash
    cd client
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm run dev
    ```

#### Backend Setup

1. Navigate to the `server` directory:

    ```bash
    cd server
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the backend server:

    ```bash
    npm run dev
    ```

## Usage

1. Ensure both frontend and backend servers are running. If using Docker, they should be running automatically after executing `docker-compose up`.

2. Open your browser and navigate to `http://localhost:5173` to access the game.

3. Create a room or join an existing one to start playing.

