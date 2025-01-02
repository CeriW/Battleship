export type HeatMapArray = number[][];

export type PositionArray = ({ name: string; hit: boolean } | null)[][];

export type ShipInfo = {
  name: 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';
  size: number;
};
