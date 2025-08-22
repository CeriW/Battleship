import React, { useContext } from "react";
import { GameContext } from "../GameContext";
import Confetti from 'react-confetti'

export const declareWinner = (player: 'user' | 'computer'): string => {
  if (player === 'user') {
    console.log('WINNER');
    window.alert('You win!');
    return 'WINNER';
  } else {
    console.log('LOSER');
    window.alert('You lose!');
    return 'LOSER';
  }
};

export const GameEndScreen = ({ player }: { player: 'user' | 'computer' }) => {


    if (player === 'user') {
        return <div className="game-end-screen">    
            <h1>You win!</h1>
            <Confetti />
        </div>
    } else if (player === 'computer') {
        return <div className="game-end-screen">
            <h1>You lose!</h1>
        </div>  
    }

    return null;
}