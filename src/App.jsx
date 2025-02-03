import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [secondClickNext, setSecondClickNext] = useState(false);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [numMoves, setMoves] = useState(0);
  const [firstClick, setFirstClick] = useState(null);
  const adjacentSquares = [
    [1, 3, 4], 
    [0, 2, 3, 4, 5], 
    [1, 4, 5], 
    [0, 1, 4, 6, 7], 
    [0, 1, 2, 3, 5, 6, 7, 8], 
    [1, 2, 4, 7, 8], 
    [3, 4, 7], 
    [3, 4, 5, 6, 8], 
    [4, 5, 7] 
  ];

  function isAdjacent(i) {
    if(adjacentSquares[firstClick].includes(i)) {
      return true;
    }

    return false;
  }

  function handleClick(i) {
    if(numMoves < 6) {
      // Tic tac toe part
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
  
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
  
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      setMoves(numMoves + 1);
    } else {
      // Chorus lapilli part
      // If it's X turn and doesn't click on an X
      if (calculateWinner(squares) || (xIsNext && squares[i] === 'O') || (!xIsNext && squares[i] === 'X') || !squares[i]) {
        return;
      }

      // If their piece is in the middle and there is no winning moves for that click
      if(((xIsNext && squares[4] === 'X' && i !== 4) || (!xIsNext && squares[4] === 'O' && i !== 4)) && !checkWinningMoves(i, squares)) {
        return;
      }
  
      setSecondClickNext(true);
      setFirstClick(i);
    }
  }

  function handleSecondClick(i) {
    //console.log('Second');
    if(calculateWinner(squares) || squares[i]) {
      setSecondClickNext(false);
      return;
    }
    const winningMoves = checkWinningMoves(firstClick, squares) || [];

    if (winningMoves.includes(i)) {
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      nextSquares[firstClick] = null;
  
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
      return;
    }

    if((xIsNext && squares[4] === 'X' && firstClick !== 4) || (!xIsNext && squares[4] === 'O' && firstClick !== 4)) {
      return;
    }

    if (isAdjacent(i)) {
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      nextSquares[firstClick] = null;
  
      setSquares(nextSquares);
      setXIsNext(!xIsNext);
    }

    setSecondClickNext(false);
  }

  function checkWinningMoves(i, squares) {
    const tempSquares = squares.slice();
    tempSquares[i] = null;
  
    const winningMoves = adjacentSquares[i].filter((move) => {
      const newSquares = tempSquares.slice();
      newSquares[move] = xIsNext ? "X" : "O";
      return calculateWinner(newSquares);
    });
  
    if(winningMoves.length === 0) {
      return null;
    }
  
    return winningMoves;
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {secondClickNext ? (
          <>
        <Square value={squares[0]} onSquareClick={() => handleSecondClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleSecondClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleSecondClick(2)} />
          </>
        ) : (
          <>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
          </>
        )}
      </div>
      <div className="board-row">
        {secondClickNext ? (
          <>
        <Square value={squares[3]} onSquareClick={() => handleSecondClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleSecondClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleSecondClick(5)} />
          </>
        ) : (
          <>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
          </>
        )}
      </div>
      <div className="board-row">
        {secondClickNext ? (
          <>
        <Square value={squares[6]} onSquareClick={() => handleSecondClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleSecondClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleSecondClick(8)} />
          </>
        ) : (
          <>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
          </>
        )}
      </div>
    </>
  );
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

