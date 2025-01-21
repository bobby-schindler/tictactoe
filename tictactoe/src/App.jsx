import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const gridSize = 3;

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getRowCol(index, gridSize) {
  const row = Math.floor(index / gridSize) + 1; // Add 1 to make it 1-based
  const col = (index % gridSize) + 1; // Add 1 to make it 1-based
  return { row, col };
}

function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateWinningLine(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
}

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i, gridSize);
  }

  const winner = calculateWinner(squares);
  const winningLine = calculateWinningLine(squares);

  const isDraw = !winner && squares.every((square) => square !== null);

  let status;
  if (winner) {
    status = "Winner:" + winner;
  } else if (isDraw) {
    status = "It's a draw.";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(gridSize)
        .fill(null)
        .map((_, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {Array(gridSize)
              .fill(null)
              .map((_, colIndex) => {
                const squareIndex = rowIndex * gridSize + colIndex;
                return (
                  <Square
                    key={squareIndex}
                    value={squares[squareIndex]}
                    onSquareClick={() => handleClick(squareIndex)}
                    isWinningSquare={winningLine?.includes(squareIndex)}
                  />
                );
              })}
          </div>
        ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const currentSquares = history[currentMove]?.squares || Array(9).fill(null);
  const xIsNext = currentMove % 2 === 0;
  //const currentPlayer = !xIsNext ? "X" : "O";

  function handlePlay(nextSquares, moveIndex, gridSize) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, moveIndex },
    ];

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const moves = history.map((entry, move) => {
    let description;
    const { row, col } = getRowCol(entry.moveIndex, gridSize); // 3 is the grid size
    const player = move % 2 === 0 ? "O" : "X"; // Determine the player for the move
    if (move === currentMove) {
      return;
    } else if (move > 0) {
      description = `Go to move # ${move} Player ${player}: Row ${row}, Col${col}`;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const sortedMoves = [...moves].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.key - b.key;
    } else {
      return b.key - a.key;
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={handleSort}>
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>
        <ol>{sortedMoves}</ol>
        <ul>
          {currentMove === 0
            ? "Choose a square"
            : "You are at move #" + currentMove}
        </ul>
      </div>
    </div>
  );
}


