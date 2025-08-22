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

export const GameEndScreen = () => {
    const { gameStatus } = useContext(GameContext);

    if (gameStatus === 'user-win') {
        return <Confetti />
    } else if (gameStatus === 'computer-win') {
        return <Confetti />
    }

    return null;
}