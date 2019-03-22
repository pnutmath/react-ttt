import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movement: null,
        winningSquares: Array(3).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    }
  }


  handleClick(i) {
    let history;
    if (this.state.isAscending) {
      history = this.state.history.slice(0, this.state.stepNumber + 1);
    } else {
      history = this.state.history.slice(0, 2);
    }
    let stepNumber;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    if (this.state.isAscending) {
      history = history.concat([{ squares: squares, movement: i }]);
      stepNumber = history.length - 1;
    } else {
      history.splice(1, 0, { squares: squares, movement: i });
      stepNumber = 1;
    }
    this.setState({ history: history, stepNumber: stepNumber, xIsNext: !this.state.xIsNext });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  toggleSort() {
    let history = this.state.history.slice();
    history = [history[0], ...history.slice(1).reverse()];
    console.log(history);
    this.setState({
      history: history,
      stepNumber: this.state.stepNumber > 0 ? history.length - this.state.stepNumber : 0,
      isAscending: !this.state.isAscending
    });

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerStatus = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const XorO = (move % 2 !== 0) ? 'X' : 'O'
      const desc = move ? `Go to move #${move} - ${XorO} -> (${(step.movement % 3) + 1},${Math.floor((step.movement / 3) + 1)})` : 'Go to game start';
      const moveSelectedClass = this.state.stepNumber === move ? "move-selected" : "";

      return (
        <li key={move}>
          <button className={moveSelectedClass} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winnerStatus) {
      current.winningSquares = winnerStatus.winningLine;
      status = 'Winner: ' + winnerStatus.winner + (<span role="img" aria-label="sheep">&#128540;</span>).props.children;
    } else if (this.state.stepNumber === 9) {
      status = 'Match Drawn!';
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="App">
        <header className="App-header">
          <h2>I am on Pluto, where are you?</h2>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} winningSquares={current.winningSquares}
              onClick={(i) => { this.handleClick(i) }} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            {/* <button className="sorting-button" onClick={() => this.toggleSort()}>{this.state.isAscending ? 'Ascending' : 'Descending'}</button> */}
          </div>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {

  renderSquare(i) {
    const isWinning = this.props.winningSquares ? this.props.winningSquares.includes(i) : false;
    return <Square key={i} value={this.props.squares[i]} isWinning={isWinning} onClick={() => { this.props.onClick(i) }} />
  }

  generateSquares() {
    for (let i = 0; i < 9; i++) {
      this.renderSquare(i);
    }

    return (<div>

    </div>);
  }

  render() {
    const gridSqaures = [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
    return (
      <div>
        {
          gridSqaures.map((square, x) => {
            return <div key={x} className="border-row">
              {square.map(i => this.renderSquare(i))}
            </div>
          })
        }
      </div>
    );
  }
}

function Square(props) {
  let buttonClass = 'square';
  buttonClass = props.isWinning ? buttonClass + ' square-wining' : buttonClass;

  return (
    <button className={buttonClass} onClick={() => { props.onClick() }}>
      {props.value}
    </button>
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
      return { winner: squares[a], winningLine: [a, b, c] };
    }
  }
  return null;
}

export default App;
