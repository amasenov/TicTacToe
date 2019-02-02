import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import NewGame from './Components/UI/NewGame/NewGame';
import Winner from './Components/UI/Winner/Winner';
import logo from './logo.svg';
import './App.scss';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerOne: {
                id: 1,
                icon: null,
                selected: []
            },
            playerTwo: {
                id: 2,
                icon: null,
                selected: []
            },
            data: [
                {id: 0, icon: null, playerId: null},
                {id: 1, icon: null, playerId: null},
                {id: 2, icon: null, playerId: null},
                {id: 3, icon: null, playerId: null},
                {id: 4, icon: null, playerId: null},
                {id: 5, icon: null, playerId: null},
                {id: 6, icon: null, playerId: null},
                {id: 7, icon: null, playerId: null},
                {id: 8, icon: null, playerId: null}
            ],
            playerOneActive: true,
            winner: null,
            playerOneBest: null,
            playerTwoBest: null
        };
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.playerOne !== this.state.playerOne && Array.isArray(this.state.playerOne.selected) && this.state.playerOne.selected.length > 2) {
            const isWinner = this.winner(this.state.data, this.state.playerOne);
            if(isWinner){
                this.setState({ winner: 'The winner is player one!!!' });
            }
        }

        if(prevState.playerTwo !== this.state.playerTwo && Array.isArray(this.state.playerTwo.selected) && this.state.playerTwo.selected.length > 2) {
            const isWinner = this.winner(this.state.data, this.state.playerTwo);
            if(isWinner){
                this.setState({ winner: 'The winner is player two!!!' });
            }
        }

        if(prevState.playerOneActive !== this.state.playerOneActive && this.state.playerOne.selected.length > 1 && this.state.playerTwo.selected.length > 1){
            const board = [...this.state.data];
            const minPlayer = this.state.playerOneActive ? {...this.state.playerOne} : {...this.state.playerTwo};
            const maxPlayer = !this.state.playerOneActive ? {...this.state.playerOne} : {...this.state.playerTwo};
            const bestMove = this.getBestMove(board, minPlayer, maxPlayer);
            
            this.setState(prevState => ({ 
                ...(this.state.playerOneActive && { playerOneBest: [...[].concat(prevState.playerOneBest).filter(num => num !== null), bestMove] }), 
                ...(!this.state.playerOneActive && { playerTwoBest: [...[].concat(prevState.playerTwoBest).filter(num => num !== null), bestMove] }) 
            }));
        }

        if(prevState.data !== this.state.data && Array.isArray(this.state.data) && this.tie(this.state.data.filter(item => item.playerId !== null))) {
            this.setState({ winner: 'The result is a draw!' });
        }
    }

    handleSelectIcon = (crossIcon) => {
        if(typeof crossIcon === 'boolean'){
            this.setState(prevState => ({
                playerOneActive: !!crossIcon,
                playerOne: {...prevState.playerOne, ...{icon: crossIcon ? faTimes : faCircle}},
                playerTwo: {...prevState.playerTwo, ...{icon: crossIcon ? faCircle : faTimes}}
            }));
        }
    }

    handleNewGame = () => {
        if(typeof this.state.winner === 'string'){
            this.setState(prevState => ({
                winner: null,
                playerOne: {...prevState.playerOne, ...{icon: null, selected: [] }},
                playerTwo: {...prevState.playerTwo, ...{icon: null, selected: []}},
                data: prevState.data.map(item => ({...item, ...{icon: null, playerId: null}})),
                playerOneBest: null,
                playerTwoBest: null
            }));
        }
    }

    handleSelection = (selected) => {
        if(selected.icon === null && !!this.state.playerOne.icon && !!this.state.playerTwo.icon) {
            this.setState(prevState => ({
                data: [
                    ...prevState.data.map(item => item.id === selected.id ? ({
                        ...selected, ...{
                            icon: !!prevState.playerOneActive ? prevState.playerOne.icon : prevState.playerTwo.icon,
                            playerId: !!prevState.playerOneActive ? prevState.playerOne.id : prevState.playerTwo.id
                        }
                    }) : item),
                ],
                playerOneActive: !prevState.playerOneActive,
                playerOne: prevState.playerOneActive ? {...prevState.playerOne, ...{selected: [...prevState.playerOne.selected, selected.id]}} : prevState.playerOne,
                playerTwo: !prevState.playerOneActive ? {...prevState.playerTwo, ...{selected: [...prevState.playerTwo.selected, selected.id]}} : prevState.playerTwo
            }));
        }
    }

    winner = (board, player) => (
        (board[0].playerId === player.id && board[1].playerId === player.id && board[2].playerId === player.id) ||
        (board[3].playerId === player.id && board[4].playerId === player.id && board[5].playerId === player.id) ||
        (board[6].playerId === player.id && board[7].playerId === player.id && board[8].playerId === player.id) ||
        (board[0].playerId === player.id && board[3].playerId === player.id && board[6].playerId === player.id) ||
        (board[1].playerId === player.id && board[4].playerId === player.id && board[7].playerId === player.id) ||
        (board[2].playerId === player.id && board[5].playerId === player.id && board[8].playerId === player.id) ||
        (board[0].playerId === player.id && board[4].playerId === player.id && board[8].playerId === player.id) ||
        (board[2].playerId === player.id && board[4].playerId === player.id && board[6].playerId === player.id)
    )

    tie = (board) => (board.length === 9)

    validMove = (element, playerId, board) => {
        const newBoard = [...board];
        if(element.playerId === null){
            element.playerId = playerId;
            return newBoard;
        } else {
            return null;
        }
    }

    getBestMove = (board, minPlayer, maxPlayer) => {
        let bestMoveScore = 100;
        let move = null;
        if(this.winner(board, maxPlayer) || this.winner(board, minPlayer) || this.tie(board.filter(item => item.icon !== null))) {
            return null;
        }

        board.forEach((element, index) => {
            if(element.playerId === null){
                const newBoard = board.map(item => item.id === element.id ? ({...item, ...{playerId: minPlayer.id}}) : (item));
                const moveScore = this.maxScore(newBoard, minPlayer, maxPlayer);
                if (moveScore < bestMoveScore) {
                    bestMoveScore = moveScore;
                    move = index;
                }
            }
        });
        
        return move;
    }
      
    minScore = (board, minPlayer, maxPlayer) => {
        if (this.winner(board, maxPlayer)) {
            return 10;
        } else if (this.winner(board, minPlayer)) {
            return -10;
        } else if (this.tie(board)) {
            return 0;
        } else {
            let bestMoveValue = 100;

            board.forEach((element, index) => {
                if(element.playerId === null){
                    const newBoard = board.map(item => item.id === element.id ? ({...item, ...{playerId: minPlayer.id}}) : (item));
                    const predictedMoveValue = this.maxScore(newBoard, minPlayer, maxPlayer);
                    
                    if (predictedMoveValue < bestMoveValue) {
                        bestMoveValue = predictedMoveValue;
                    }
                }
            });
              
            return bestMoveValue;
        }
    }
      
    maxScore = (board, minPlayer, maxPlayer) => {
        if(this.winner(board, maxPlayer)) {
            return 10;
        } else if(this.winner(board, minPlayer)) {
            return -10;
        } else if(this.tie(board)) {
            return 0;
        } else {
            let bestMoveValue = -100;

            board.forEach((element, index) => {
                if(element.playerId === null){
                    const newBoard = board.map(item => item.id === element.id ? ({...item, ...{playerId: minPlayer.id}}) : (item));
                    const predictedMoveValue = this.minScore(newBoard, minPlayer, maxPlayer);
                  
                    if (predictedMoveValue > bestMoveValue) {
                        bestMoveValue = predictedMoveValue;
                    }
                }
            });
              
            return bestMoveValue;
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </header>
                <main className="Main">
                    <Winner isOpen={!!this.state.winner} winner={this.state.winner} startNewGame={this.handleNewGame} />
                    <NewGame isOpen={!this.state.playerOne.icon || !this.state.playerTwo.icon} selectIcon={this.handleSelectIcon} />
                    <div className={['Board'].join(' ')}>
                        {this.state.data.map(item => (
                            <div 
                                key={item.id} 
                                className={['Board-Item', `Board-Item--${item.id}`].join(' ')} 
                                onClick={() => this.handleSelection(item)}
                            >
                                {item.icon !== null ? (
                                    <FontAwesomeIcon icon={item.icon}/>
                                ) : null}
                            </div>
                        ))}
                    </div>
                    {this.state.playerOneBest !== null || this.state.playerTwoBest !== null ? (
                        <ul className={['no-list-style', 'flex', 'flex--column'].join(' ')} >
                            {this.state.playerOneBest !== null ? (
                                <li>
                                      Player one best move: {this.state.playerOneBest.map((num,index) => (
                                        <span key={index}>
                                            {index > 0 ? (<span>,&nbsp;</span>) : null}{num}
                                        </span>
                                    ))}
                                </li>
                            ) : null}
                            {this.state.playerTwoBest !== null ? (
                                <li>
                                      Player two best move: {this.state.playerTwoBest.map((num,index) => (
                                        <span key={index}>
                                            {index > 0 ? (<span>,&nbsp;</span>) : null}{num}
                                        </span>
                                    ))}
                                </li>
                            ) : null}
                        </ul>
                    ) : null}
                </main>
            </div>
        );
    }
}

export default App;
