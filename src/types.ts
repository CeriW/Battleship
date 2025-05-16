export type HeatMapArray = number[][];

export type ShipNames = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

export type ShipInfo = {
  name: ShipNames;
  size: number;
};

export enum CellStates {
  hit = 'hit',
  miss = 'miss',
  unguessed = 'unguessed',
}

export type PositionArray = ({ name: ShipNames | null; status: CellStates } | null)[][];

export type Alignment = 'horizontal' | 'vertical';

export type AiLevel = 'easy' | 'medium' | 'hard';
