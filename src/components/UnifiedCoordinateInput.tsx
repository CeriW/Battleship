import React, { useState, useEffect } from 'react';

interface UnifiedCoordinateInputProps {
  onGuess: (row: number, col: number) => void;
  disabled: boolean;
  variant?: 'toolbar' | 'mobile';
  className?: string;
}

export const UnifiedCoordinateInput: React.FC<UnifiedCoordinateInputProps> = ({
  onGuess,
  disabled,
  variant = 'toolbar',
  className = '',
}) => {
  const [coordinateInput, setCoordinateInput] = useState('');
  const [showOnSmallScreen, setShowOnSmallScreen] = useState(false);
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  // Check screen size for both variants
  useEffect(() => {
    const checkScreenSize = () => {
      setShowOnSmallScreen(window.innerWidth < 700);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // For mobile variant, only show on small screens
  if (variant === 'mobile' && !showOnSmallScreen) {
    return null;
  }

  // For toolbar variant, only show on larger screens
  if (variant === 'toolbar' && showOnSmallScreen) {
    return null;
  }

  const isMobile = variant === 'mobile';
  const formClass = isMobile ? 'coordinate-form' : 'coordinate-form-toolbar';
  const inputClass = isMobile ? 'coordinate-input' : 'coordinate-input-toolbar';
  const buttonClass = isMobile ? 'coordinate-submit' : 'coordinate-submit-toolbar';
  const placeholder = isMobile ? 'Type coordinates (A1, B5, J10)' : 'Type your coordinates here or click on the board';

  const formElement = (
    <form onSubmit={handleCoordinateSubmit} className={formClass}>
      <input
        type="text"
        value={coordinateInput}
        onChange={(e) => setCoordinateInput(e.target.value)}
        placeholder={placeholder}
        maxLength={3}
        className={inputClass}
        disabled={disabled}
        autoComplete="off"
        autoCapitalize="characters"
      />
      <button type="submit" disabled={disabled || !coordinateInput.trim()} className={buttonClass}>
        Fire!
      </button>
    </form>
  );

  if (isMobile) {
    return (
      <div className={`aim-interface ${className}`}>
        <div className="aim-controls">{formElement}</div>
      </div>
    );
  }

  return formElement;
};

export default UnifiedCoordinateInput;
