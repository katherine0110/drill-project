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
    const tempList = [...data];
    const xList = tempList.sort((a, b) => b.x - a.x);
    const yList = tempList.sort((a, b) => b.y - a.y);
    if (xList[0].x > 63 || yList[0].y > 63 || xList[11].x < 0 || yList[11].y < 0) {
      return originSquad;
    }
    return data;
  }

  getNewSquad(markerPosition: Position, formation: formation, frontMarker: boolean): Position[] {
    let squadPosition: Position[];
    let squadFacing = markerPosition.facing;

    if (
      (frontMarker && ((formation === 'line' && squadFacing === 'up') || (formation === 'column' && squadFacing === 'right'))) ||
      (!frontMarker && ((formation === 'line' && squadFacing === 'down') || (formation === 'column' && squadFacing === 'left')))
    ) {
      //line with marker at top
      squadPosition = [
        { x: markerPosition.x, y: markerPosition.y, facing: squadFacing},
        { x: markerPosition.x, y: markerPosition.y - 3, facing: squadFacing },
        { x: markerPosition.x, y: markerPosition.y - 6, facing: squadFacing },
        { x: markerPosition.x, y: markerPosition.y - 9, facing: squadFacing },
        { x: markerPosition.x + 3, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x + 3, y: markerPosition.y - 3, facing: squadFacing },
        { x: markerPosition.x + 3, y: markerPosition.y - 6, facing: squadFacing },
        { x: markerPosition.x + 3, y: markerPosition.y - 9, facing: squadFacing },
        { x: markerPosition.x + 6, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x + 6, y: markerPosition.y - 3, facing: squadFacing },
        { x: markerPosition.x + 6, y: markerPosition.y - 6, facing: squadFacing },
        { x: markerPosition.x + 6, y: markerPosition.y - 9, facing: squadFacing },
      ];
    }else if (
      (frontMarker && ((formation === 'line' && squadFacing === 'down') || (formation === 'column' && squadFacing === 'left'))) ||
      (!frontMarker && ((formation === 'line' && squadFacing === 'up') || (formation === 'column' && squadFacing === 'right')))
    ) {
      //line with marker at bottom
      squadPosition = [
        { x: markerPosition.x, y: markerPosition.y, facing: squadFacing},
        { x: markerPosition.x, y: markerPosition.y + 3, facing: squadFacing },
        { x: markerPosition.x, y: markerPosition.y + 6, facing: squadFacing },
        { x: markerPosition.x, y: markerPosition.y + 9, facing: squadFacing },
        { x: markerPosition.x - 3, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x - 3, y: markerPosition.y + 3, facing: squadFacing },
        { x: markerPosition.x - 3, y: markerPosition.y + 6, facing: squadFacing },
        { x: markerPosition.x - 3, y: markerPosition.y + 9, facing: squadFacing },
        { x: markerPosition.x - 6, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x - 6, y: markerPosition.y + 3, facing: squadFacing },
        { x: markerPosition.x - 6, y: markerPosition.y + 6, facing: squadFacing },
        { x: markerPosition.x - 6, y: markerPosition.y + 9, facing: squadFacing },
      ];
    }else if (
      (frontMarker && ((formation === 'column' && squadFacing === 'up') || (formation === 'line' && squadFacing === 'left'))) ||
      (!frontMarker && ((formation === 'column' && squadFacing === 'down') || (formation === 'line' && squadFacing === 'right')))
    ) {
      //column with marker at top
      squadPosition = [
        { x: markerPosition.x, y: markerPosition.y, facing: squadFacing},
        { x: markerPosition.x + 3, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x + 6, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x + 9, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x, y: markerPosition.y + 3, facing: squadFacing },
        { x: markerPosition.x + 3, y: markerPosition.y + 3, facing: squadFacing },
        { x: markerPosition.x + 6, y: markerPosition.y + 3, facing: squadFacing },
        { x: markerPosition.x + 9, y: markerPosition.y + 3, facing: squadFacing },
        { x: markerPosition.x, y: markerPosition.y + 6, facing: squadFacing },
        { x: markerPosition.x + 3, y: markerPosition.y + 6, facing: squadFacing },
        { x: markerPosition.x + 6, y: markerPosition.y + 6, facing: squadFacing },
        { x: markerPosition.x + 9, y: markerPosition.y + 6, facing: squadFacing },
      ];
    }else {
      //column with marker at bottom
      squadPosition = [
        { x: markerPosition.x, y: markerPosition.y, facing: squadFacing},
        { x: markerPosition.x - 3, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x - 6, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x - 9, y: markerPosition.y, facing: squadFacing },
        { x: markerPosition.x, y: markerPosition.y - 3, facing: squadFacing },
        { x: markerPosition.x - 3, y: markerPosition.y - 3, facing: squadFacing },
        { x: markerPosition.x - 6, y: markerPosition.y - 3, facing: squadFacing },
        { x: markerPosition.x - 9, y: markerPosition.y - 3, facing: squadFacing },
        { x: markerPosition.x, y: markerPosition.y - 6, facing: squadFacing },
        { x: markerPosition.x - 3, y: markerPosition.y - 6, facing: squadFacing },
        { x: markerPosition.x - 6, y: markerPosition.y - 6, facing: squadFacing },
        { x: markerPosition.x - 9, y: markerPosition.y - 6, facing: squadFacing },
      ];
    }
    return squadPosition;
}
}