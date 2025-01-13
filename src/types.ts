// export type HeatMapCell = {
//   heat: number; // The likelihood of a ship being in this cell based on adjacent hits/misses
//   heatMultiplier: number; // The likelihood of a ship being in this cell, based on whether ships will fit in the spaces around it
// };

export type HeatMapArray = number[][];

export type ShipInfo = {
  name: 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';
  size: number;
};

export enum CellStates {
  hit = -1,
  miss = -2,
  unguessed = 0,
}

export type PositionArray = { name: string | null; status: CellStates }[][];

export type Alignment = 'horizontal' | 'vertical';
