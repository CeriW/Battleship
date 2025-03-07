export type HeatMapArray = number[][];

export type ShipNames = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

export type ShipInfo = {
  name: ShipNames;
  size: number;
};

export enum CellStates {
  // hit = -1,
  // miss = -2,
  // unguessed = 0,

  hit = 'hit',
  miss = 'miss',
  unguessed = 'unguessed',
}

export type PositionArray = ({ name: ShipNames | null; status: CellStates } | null)[][];

export type Alignment = 'horizontal' | 'vertical';
