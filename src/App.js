import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    console.log(i);
    if (squares[i] || calculateWinner(squares)) {
      return;
    } //return if square already has a value

    const nextSquares = squares.slice(); //copy the squares array
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function renderSquare(index) {
    return (
      <Square
        key={index}
        value={squares[index]}
        onSquareClick={() => handleClick(index)}
      />
    );
  }

  function renderRow(row) {
    let index = row * 3;
    let rowContent = [];
    for (let col = 0; col < 3; col++) {
      rowContent.push(renderSquare(index));
      index++;
    }
    return rowContent;
  }

  function renderBoard() {
    const rows = [];
    for (let row = 0; row < 3; row++) {
      rows.push(
        <div key={row} className="board-row">
          {renderRow(row)}
        </div>
      );
    }
    return rows;
  }

  return (
    <>
      <div className="status">{status}</div>
      {renderBoard()}
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

function HistoryPanel({
  currentMove,
  sortDesc,
  history,
  onChangeSort,
  onJumpTo,
}) {
  const moves = history.map((squares, move) => {
    let content;
    if (move === currentMove) {
      content = <span>{`Current move #${move}`}</span>;
    } else if (move === 0) {
      content = (
        <button onClick={() => onJumpTo(move)}>Go to game start</button>
      );
    } else {
      const change = calculateHistoryChange(history[move], history[move - 1]);
      const description = `Go to move # ${move} (${change.value} in [${change.row}, ${change.col}])`;
      content = <button onClick={() => onJumpTo(move)}>{description}</button>;
    }

    return <li key={move}>{content}</li>;
  });

  const sortDescription = `Sort ${sortDesc ? "ASC" : "DESC"}`;

  return (
    <div className="game-info">
      <button onClick={onChangeSort}>{sortDescription}</button>
      {sortDesc ? (
        <ol start="0">{moves}</ol>
      ) : (
        <ol start={moves.length - 1} reversed>
          {moves.reverse()}
        </ol>
      )}
    </div>
  );
}

function getRowColFromIndex(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return { row: row, col: col };
}

function calculateHistoryChange(move, previousMove) {
  let change = {};
  move.forEach((value, i) => {
    if (value != null && previousMove[i] == null) {
      change = { value: value, ...getRowColFromIndex(i) };
    }
  });
  return change;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortDesc, setSortDesc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function changeSort() {
    setSortDesc(!sortDesc);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <HistoryPanel
        currentMove={currentMove}
        sortDesc={sortDesc}
        history={history}
        onChangeSort={changeSort}
        onJumpTo={jumpTo}
      />
    </div>
  );
}
