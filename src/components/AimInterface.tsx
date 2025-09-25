import React, { useState } from 'react';

interface AimInterfaceProps {
  onGuess: (row: number, col: number) => void;
  disabled: boolean;
}

export const AimInterface: React.FC<AimInterfaceProps> = ({ onGuess, disabled }) => {
  const [coordinateInput, setCoordinateInput] = useState('');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const handleCoordinateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = coordinateInput.toUpperCase().trim();

    if (input.length >= 2) {
      const letter = input[0];
      const number = parseInt(input.slice(1));

      const row = letters.indexOf(letter);
      const col = number - 1;

      if (row >= 0 && row < 10 && col >= 0 && col < 10) {
        onGuess(row, col);
        setCoordinateInput('');
      }
    }
  };

  return (
    <div className="aim-interface">
      <div className="aim-controls">
        <form onSubmit={handleCoordinateSubmit} className="coordinate-form">
          <input
            type="text"
            value={coordinateInput}
            onChange={(e) => setCoordinateInput(e.target.value)}
            placeholder="Type your coordinates (e.g., A1, B5, J10)"
            maxLength={3}
            className="coordinate-input"
            disabled={disabled}
            autoComplete="off"
            autoCapitalize="characters"
          />
          <button type="submit" disabled={disabled || !coordinateInput.trim()}>
            Fire!
          </button>
        </form>
      </div>

      <div className="aim-instructions">
        <p>Click on the grid below or type coordinates to make your guess</p>
      </div>
    </div>
  );
};

export default AimInterface;
