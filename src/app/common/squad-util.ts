export type squadDirection = 'up' | 'right' | 'down' | 'left' | undefined;

export type formation = 'column' | 'line' | undefined;

export type memberDirection = 'up' | 'upright' | 'right' | 'downright' | 'down' | 'downleft' | 'left' | 'upleft' | undefined;

export interface Position {
    x: number;
    y: number;
    facing: any;
}

export class SquadFunc {
  calculateSquad(markerPosition: Position, formation: formation, frontMarker: boolean, originSquad: Position[]): Position[] {
    const data = this.getNewSquad(markerPosition, formation, frontMarker);
    //sort in descending order
    const xList = data.sort((a, b) => b.x - a.x);
    const yList = data.sort((a, b) => b.y - a.y);
    if (xList[0].x > 63 || yList[0].y > 63 || xList[11].x < 0 || yList[11].y < 0) {
      return originSquad;
    }
    return data;
  }

  getNewSquad(markerPosition: Position, formation: formation, frontMarker: boolean): Position[] {
    let squadPosition: Position[];
    if (
      (formation === 'column' && (markerPosition.facing === 'up' || markerPosition.facing === 'down')) ||
      (formation === 'line' && (markerPosition.facing === 'left' || markerPosition.facing === 'right'))
    ) {
      if (frontMarker) {
        squadPosition = [
          { x: markerPosition.x, y: markerPosition.y, facing: markerPosition.facing},
          { x: markerPosition.x + 3, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x + 6, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x + 9, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x, y: markerPosition.y + 3, facing: markerPosition.facing },
          { x: markerPosition.x + 3, y: markerPosition.y + 3, facing: markerPosition.facing },
          { x: markerPosition.x + 6, y: markerPosition.y + 3, facing: markerPosition.facing },
          { x: markerPosition.x + 9, y: markerPosition.y + 3, facing: markerPosition.facing },
          { x: markerPosition.x, y: markerPosition.y + 6, facing: markerPosition.facing },
          { x: markerPosition.x + 3, y: markerPosition.y + 6, facing: markerPosition.facing },
          { x: markerPosition.x + 6, y: markerPosition.y + 6, facing: markerPosition.facing },
          { x: markerPosition.x + 9, y: markerPosition.y + 6, facing: markerPosition.facing },
        ];
      } else {
        squadPosition = [
          { x: markerPosition.x, y: markerPosition.y, facing: markerPosition.facing},
          { x: markerPosition.x - 3, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x - 6, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x - 9, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x, y: markerPosition.y - 3, facing: markerPosition.facing },
          { x: markerPosition.x - 3, y: markerPosition.y - 3, facing: markerPosition.facing },
          { x: markerPosition.x - 6, y: markerPosition.y - 3, facing: markerPosition.facing },
          { x: markerPosition.x - 9, y: markerPosition.y - 3, facing: markerPosition.facing },
          { x: markerPosition.x, y: markerPosition.y - 6, facing: markerPosition.facing },
          { x: markerPosition.x - 3, y: markerPosition.y - 6, facing: markerPosition.facing },
          { x: markerPosition.x - 6, y: markerPosition.y - 6, facing: markerPosition.facing },
          { x: markerPosition.x - 9, y: markerPosition.y - 6, facing: markerPosition.facing },
        ];
      }
    } else {
      if (frontMarker) {
        squadPosition = [
          { x: markerPosition.x, y: markerPosition.y, facing: markerPosition.facing},
          { x: markerPosition.x, y: markerPosition.y - 3, facing: markerPosition.facing },
          { x: markerPosition.x, y: markerPosition.y - 6, facing: markerPosition.facing },
          { x: markerPosition.x, y: markerPosition.y - 9, facing: markerPosition.facing },
          { x: markerPosition.x + 3, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x + 3, y: markerPosition.y - 3, facing: markerPosition.facing },
          { x: markerPosition.x + 3, y: markerPosition.y - 6, facing: markerPosition.facing },
          { x: markerPosition.x + 3, y: markerPosition.y - 9, facing: markerPosition.facing },
          { x: markerPosition.x + 6, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x + 6, y: markerPosition.y - 3, facing: markerPosition.facing },
          { x: markerPosition.x + 6, y: markerPosition.y - 6, facing: markerPosition.facing },
          { x: markerPosition.x + 6, y: markerPosition.y - 9, facing: markerPosition.facing },
        ];
      } else {
        squadPosition = [
          { x: markerPosition.x, y: markerPosition.y, facing: markerPosition.facing},
          { x: markerPosition.x, y: markerPosition.y + 3, facing: markerPosition.facing },
          { x: markerPosition.x, y: markerPosition.y + 6, facing: markerPosition.facing },
          { x: markerPosition.x, y: markerPosition.y + 9, facing: markerPosition.facing },
          { x: markerPosition.x - 3, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x - 3, y: markerPosition.y + 3, facing: markerPosition.facing },
          { x: markerPosition.x - 3, y: markerPosition.y + 6, facing: markerPosition.facing },
          { x: markerPosition.x - 3, y: markerPosition.y + 9, facing: markerPosition.facing },
          { x: markerPosition.x - 6, y: markerPosition.y, facing: markerPosition.facing },
          { x: markerPosition.x - 6, y: markerPosition.y + 3, facing: markerPosition.facing },
          { x: markerPosition.x - 6, y: markerPosition.y + 6, facing: markerPosition.facing },
          { x: markerPosition.x - 6, y: markerPosition.y + 9, facing: markerPosition.facing },
        ];
      }
    }
    return squadPosition;
}
}