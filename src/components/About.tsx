import React from 'react';
import { Link } from 'react-router-dom';
import { SkipTrackButton } from './SkipTrackButton';
import './About.scss';

export const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>ABOUT BATTLESHIP</h1>

        <div className="about-content">
          <section>
            <p>
              Battleship is a classic strategy game where you try to sink your opponent's fleet before they sink yours.
              Place your ships strategically and take turns guessing coordinates to find and destroy enemy vessels.
            </p>
            <p>
              It was made my myself, Ceri Woolway as a pet project to learn new technologies to help me in my software
              engineering career. If you'd like to know more you can check out the{' '}
              <a href="https://github.com/CeriW/Battleship" target="_blank" rel="noopener noreferrer">
                GitHub repository
              </a>{' '}
              for more information on this project.
            </p>
            <p>
              This project was made using assets from{' '}
              <a href="https://www.zapsplat.com" target="_blank" rel="noopener noreferrer">
                Zapsplat
              </a>
              ,{' '}
              <a href="https://www.flaticon.com" target="_blank" rel="noopener noreferrer">
                Flaticon
              </a>
              , and{' '}
              <a href="https://www.freepik.com" target="_blank" rel="noopener noreferrer">
                Freepik
              </a>
              .
            </p>
          </section>
        </div>

        <div className="about-actions">
          <SkipTrackButton />
          <Link to="/" className="button">
            Back to Game
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
