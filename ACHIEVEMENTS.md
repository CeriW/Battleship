# Battleship Achievements System

This document describes the achievement system implemented for the Battleship game.

## Overview

The achievement system adds gamification elements to the battleship game, tracking player progress and unlocking rewards for various accomplishments.

## Features

### Achievement Categories

1. **Victory Achievements** - Win conditions and milestones
2. **Accuracy Achievements** - Hit/miss ratios and precision
3. **Speed Achievements** - Quick wins and efficiency
4. **Strategy Achievements** - Specific tactics and positioning
5. **Endurance Achievements** - Multiple games and streaks
6. **Difficulty Achievements** - AI level challenges
7. **Special Achievements** - Unique accomplishments

### Achievement Types

#### Victory Achievements

- **First Victory** - Win your first game
- **Perfect Game** - Win without missing a single shot
- **Lightning Strike** - Win a game in 20 shots or less

#### Accuracy Achievements

- **Sniper** - Achieve 90% accuracy in a single game
- **No Miss Master** - Win a game without missing any shots

#### Strategy Achievements

- **Destroyer Master** - Sink 10 destroyers
- **Carrier Hunter** - Sink 5 carriers
- **Corner Specialist** - Hit 20 corner positions (A1, A10, J1, J10)
- **Center Master** - Hit 30 center positions (D4-D7, E4-E7)

#### Endurance Achievements

- **Hot Streak** - Win 3 games in a row
- **On Fire** - Win 5 games in a row
- **Unstoppable** - Win 10 games in a row
- **Getting Started** - Play 10 games
- **Dedicated Player** - Play 50 games
- **Battleship Veteran** - Play 100 games

#### Difficulty Achievements

- **Hard Mode Master** - Win 10 games on hard difficulty

#### Special Achievements

- **Comeback King** - Win a game after losing 3 ships
- **One Shot, One Kill** - Sink a ship with your first hit on it
- **Lucky Guess** - Hit 5 ships in a row
- **Battleship Legend** - Unlock all other achievements

### Rarity System

Achievements are categorized by rarity:

- **Common** (Gray) - Basic achievements
- **Uncommon** (Green) - Moderate difficulty
- **Rare** (Blue) - Challenging accomplishments
- **Epic** (Purple) - Very difficult
- **Legendary** (Gold) - Extremely rare

### Points System

Each achievement awards points based on rarity:

- Common: 10-20 points
- Uncommon: 25-40 points
- Rare: 50-75 points
- Epic: 100+ points
- Legendary: 200+ points

## UI Components

### Achievement Button

- Fixed position button showing unlocked achievements count and total points
- Pulsing animation when new achievements are unlocked
- Notification badge for unread achievements

### Achievement Panel

- Comprehensive view of all achievements
- Filtering by category
- Sorting options (name, rarity, points, unlocked)
- Progress tracking for incomplete achievements
- Statistics display

### Achievement Notifications

- Pop-up notifications when achievements are unlocked
- Auto-dismiss after 5 seconds
- Rarity-based styling and animations

## Technical Implementation

### State Management

- `AchievementContext` provides centralized state management
- Local storage persistence for achievements and progress
- Real-time achievement checking

### Tracking System

- `useAchievementTracker` hook monitors game events
- Automatic progress updates based on player actions
- Achievement unlocking logic

### Integration

- Seamlessly integrated with existing game events
- No impact on game performance
- Modular design for easy extension

## Usage

The achievement system is automatically active once the `AchievementProvider` is added to the app. Players can:

1. View achievements by clicking the achievement button
2. See progress on incomplete achievements
3. Receive notifications when unlocking new achievements
4. Track their overall progress and points

## Future Enhancements

Potential additions to the achievement system:

- Daily/weekly challenges
- Achievement categories for different play styles
- Social features (sharing achievements)
- Seasonal achievements
- Custom achievement creation
