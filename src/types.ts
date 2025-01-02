export type HeatMapCell = {
  heat: number;
  heatMultiplier: number;
};

export type HeatMapArray = HeatMapCell[][];

export type ShipInfo = {
  name: 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';
  size: number;
};

export enum CellStates {
  hit = -1,
  miss = -2,
  unguessed = 0,
}

export type PositionArray = { name: string | null; hit: CellStates }[][];
