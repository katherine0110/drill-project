import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CellComponent } from './cell/cell.component';
import { Position } from './position';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { squadDirection } from "./squadDirection";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, CellComponent, ButtonModule, DropdownModule, ConfirmDialogModule, InputNumberModule],
  providers: [ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  score = 0;
  gridSizeX = 50;
  gridSizeY = 90;
  interval = 500;
  cells: Position[] = [];

  Directions: squadDirection[] = ['up', 'right', 'down', 'left', 'up', 'right', 'down'];
  markerPosition: Position = { x: this.gridSizeX / 2, y: this.gridSizeY / 2, facing: 'up' };
  squadPosition: Position[] = [
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2, facing: 'up' },
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 - 3, facing: 'up' },
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 - 6, facing: 'up' },
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 - 9, facing: 'up' },
    { x: this.gridSizeX / 2 + 2, y: this.gridSizeY / 2, facing: 'up' },
    { x: this.gridSizeX / 2 + 2, y: this.gridSizeY / 2 - 3, facing: 'up' },
    { x: this.gridSizeX / 2 + 2, y: this.gridSizeY / 2 - 6, facing: 'up' },
    { x: this.gridSizeX / 2 + 2, y: this.gridSizeY / 2 - 9, facing: 'up' },
    { x: this.gridSizeX / 2 + 4, y: this.gridSizeY / 2, facing: 'up' },
    { x: this.gridSizeX / 2 + 4, y: this.gridSizeY / 2 - 3, facing: 'up' },
    { x: this.gridSizeX / 2 + 4, y: this.gridSizeY / 2 - 6, facing: 'up' },
    { x: this.gridSizeX / 2 + 4, y: this.gridSizeY / 2 - 9, facing: 'up' },
  ];

  stepDirectionList = [
    { label: 'Step Forward', value: 'forward' },
    { label: 'Step Back', value: 'back' },
    { label: 'Right Close', value: 'right' },
    { label: 'Left Close', value: 'left' }
  ];
  selectedStepDirection = '';
  numOfStep = 0;
  inputNumOfStep = 0;
  isStepping = false;
  steppingDirection: squadDirection = undefined;

  direction: squadDirection = 'up';
  isMarching = false;
  isInline = true;

  wheelDirection: squadDirection = undefined;
  isWheeling = false;
  wheelingStep = 0;
  wheelingDrillIndex: number[] = [];

  templateColumnStyle = new Array(this.gridSizeY).fill('1fr').join(' ');

  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    // determine number of columns for styles
    this.generateBoard();

    setInterval(() => {
      this.updateGame();
    }, this.interval);
  }

  generateBoard() {
    for (let row = 0; row < this.gridSizeX; row++) {
      for (let col = 0; col < this.gridSizeY; col++) {
        this.cells.push({ x: row, y: col, facing: 'up' });
      }
    }
  }

  generateSquad(forming: string) {
    if (forming === 'lineFacingUp') {

    }
    this.squadPosition
  }

  updateGame() {
    let newPosition: Position;

    if (this.isMarching) {
      newPosition = this.calculateMoving(this.direction, this.direction);
      this.determineCanMove(1, newPosition).then((canUpdate) => {
        if (canUpdate) {
          this.calculateNewDrill(newPosition, false);
        }
      })
    }

    if (this.isStepping) {
      this.numOfStep--;
      newPosition = this.calculateMoving(this.steppingDirection, this.direction);
      this.calculateNewDrill(newPosition, false);
      if (this.numOfStep === 0) {
        this.inputNumOfStep = 0;
        this.isStepping = false
      }
    }

    if (this.isWheeling) {
      newPosition = this.calculateMoving(this.direction, this.direction);
      this.calculateNewDrill(newPosition, true);
    }
  }

  calculateMoving(movingDirection: squadDirection, facingDirection: squadDirection): Position {
    let xChange = 0;
    let yChange = 0;

    switch (movingDirection) {
      case 'right':
        yChange = 1;
        break;
      case 'left':
        yChange = -1;
        break;
      case 'up':
        xChange = -1;
        break;
      case 'down':
        xChange = 1;
        break;
      default:
        xChange = 0;
        yChange = 0;
    }
    return { x: xChange, y: yChange, facing: facingDirection };
  }

  changeDirection(newDirection: string) {
    const newDrill = this.squadPosition.slice();
    let directionIndex = this.direction === 'up' ? this.Directions.indexOf(this.direction, 2) : this.Directions.indexOf(this.direction);
    switch (newDirection) {
      case 'right':
        this.direction = this.Directions[directionIndex + 1];
        this.isInline = !this.isInline;
        break;
      case 'left':
        this.direction = this.Directions[directionIndex - 1];
        this.isInline = !this.isInline;
        break;
      case 'about':
        this.direction = this.Directions[directionIndex + 2];
    }
    newDrill.forEach((memberPosition) => {
      memberPosition.facing = this.direction;
    })
    this.squadPosition = newDrill;
  }

  stepping() {
    if (this.selectedStepDirection.length === 0 || this.inputNumOfStep === 0) {
      this.confirmationService.confirm({
        message: 'Please complete the Stepping command!',
        rejectVisible: false,
        acceptLabel: 'OK',
      })
    } else {
      let directionIndex = this.direction === 'up' ? this.Directions.indexOf(this.direction, 2) : this.Directions.indexOf(this.direction);
      switch (this.selectedStepDirection) {
        case 'forward':
          this.steppingDirection = this.Directions[directionIndex];
          break;
        case 'back':
          this.steppingDirection = this.Directions[directionIndex + 2];
          break;
        case 'right':
          this.steppingDirection = this.Directions[directionIndex + 1];
          break;
        case 'left':
          this.steppingDirection = this.Directions[directionIndex - 1];
      }

      //determine if can move
      let newPosition: Position;
      newPosition = this.calculateMoving(this.steppingDirection, this.direction);
      this.determineCanMove(this.inputNumOfStep, newPosition).then((canUpdate) => {
        if (canUpdate) {
          this.isStepping = true;
          this.numOfStep = this.inputNumOfStep;
        } else {
          this.confirmationService.confirm({
            message: 'Not enough space!',
            rejectVisible: false,
            acceptLabel: 'OK',
          })
        }
      })

    }
  }

  async determineCanMove(numOfStep: number, newPosition: Position): Promise<boolean> {
    const newDrill = this.squadPosition.slice();
    let canUpdate = true;
    newDrill.forEach((memberPosition) => {
      const newX = memberPosition.x + numOfStep * (newPosition.x);
      const newY = memberPosition.y + numOfStep * (newPosition.y);

      if (
        newX >= this.gridSizeX ||
        newX < 0 ||
        newY >= this.gridSizeY ||
        newY < 0
      ) {
        console.log("stop")
        canUpdate = false;
        return;
      }
    })
    return canUpdate;
  }

  wheeling(wheelDirection: string) {
    let directionIndex = this.direction === 'up' ? this.Directions.indexOf(this.direction, 2) : this.Directions.indexOf(this.direction);
    switch (wheelDirection) {
      case 'right':
        this.wheelDirection = this.Directions[directionIndex + 1];
        break;
      case 'left':
        this.wheelDirection = this.Directions[directionIndex - 1];
    }

    //determine if can move
    let newPosition: Position;
    newPosition = this.calculateMoving(this.wheelDirection, this.direction);

    this.determineCanMove(14, newPosition).then((canUpdate) => {
      if (canUpdate) {
        newPosition = this.calculateMoving(this.direction, this.direction);
        return this.determineCanMove(10, newPosition);
      } else {
        this.confirmationService.confirm({
          message: 'Not enough space!',
          rejectVisible: false,
          acceptLabel: 'OK',
        })
        return false;
      }
    }).then((canUpdate) => {
      if (canUpdate) {
        this.isWheeling = true;
        this.isMarching = false;
        this.getDrillIndex();
      } else {
        this.confirmationService.confirm({
          message: 'Not enough space!',
          rejectVisible: false,
          acceptLabel: 'OK',
        })
      }
    })
  }

  calculateNewDrill(newPosition: Position, whelling: boolean) {
    const newDrill = this.squadPosition.slice();

    if (whelling) {
      let drillIndex = this.wheelingDrillIndex;
      let yChange = this.direction === 'left' ? -1 : 1;
      let xChange = this.direction === 'up' ? -1 : 1;

      if (this.wheelDirection === 'up' || this.wheelDirection === 'down') {
        if(this.wheelDirection === 'up'){
          xChange = -1;
        }
        let middleDirectinon = `${this.wheelDirection}${this.direction}`;
        if (this.wheelingStep === 0) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 0:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (1 * yChange), facing: middleDirectinon };
                break;
              case 1:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: middleDirectinon };
                break;
              case 2:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: this.direction };
            }
          })
        } else if (this.wheelingStep === 1){
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 0:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y + (1 * yChange), facing: middleDirectinon };
                break;
              case 1:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y + (3 * yChange), facing: middleDirectinon };
                break;
              case 2:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y + (5 * yChange), facing: middleDirectinon };
                break;
              case 3:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: middleDirectinon };
                break;
              case 4:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: middleDirectinon };
                break;
              case 5:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (4 * yChange), facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.direction };
            }
          })
        } else if (this.wheelingStep === 2) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 0:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 1:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 2:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 3:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y + (1 * yChange), facing: middleDirectinon };
                break;
              case 4:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y + (3 * yChange), facing: middleDirectinon };
                break;
              case 5:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y + (5 * yChange), facing: middleDirectinon };
                break;
              case 6:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: middleDirectinon };
                break;
              case 7:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: middleDirectinon };
                break;
              case 8:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (4 * yChange), facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.direction };
            }
          })
        } else if (this.wheelingStep === 3) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 3:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 4:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 5:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 6:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y + (1 * yChange), facing: middleDirectinon };
                break;
              case 7:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y + (3 * yChange), facing: middleDirectinon };
                break;
              case 8:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y + (5 * yChange), facing: middleDirectinon };
                break;
              case 9:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: middleDirectinon };
                break;
              case 10:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: middleDirectinon };
                break;
              case 11:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (4 * yChange), facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.direction };
            }
          })
        } else if (this.wheelingStep === 4) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 6:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 7:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 8:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 9:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y + (1 * yChange), facing: middleDirectinon };
                break;
              case 10:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y + (3 * yChange), facing: middleDirectinon };
                break;
              case 11:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y + (5 * yChange), facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.wheelDirection };
            }
          })
        } else if (this.wheelingStep === 5) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 9:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 10:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              case 11:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: this.wheelDirection };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.wheelDirection };
            }
          })
        } else if (this.wheelingStep === 6) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.wheelDirection };
            }
          })
        }
      }

      if (this.wheelDirection === 'left' || this.wheelDirection === 'right') {
        if(this.wheelDirection === 'left'){
          yChange = -1;
        }
        let middleDirectinon = `${this.direction}${this.wheelDirection}`;
        if (this.wheelingStep === 0) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 0:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              case 1:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              case 2:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (4 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.direction };
            }
          })
        } else if (this.wheelingStep === 1) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 0:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y + (2 * yChange), facing: middleDirectinon };
                break;
              case 1:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y + (4 * yChange), facing: middleDirectinon };
                break;
              case 2:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y + (6 * yChange), facing: middleDirectinon };
                break;
              case 3:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              case 4:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              case 5:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (4 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: this.direction };
            }
          })
        } else if (this.wheelingStep === 2) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 0:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: this.wheelDirection };
                break;
              case 1:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.wheelDirection };
                break;
              case 2:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (4 * yChange), facing: this.wheelDirection };
                break;
              case 3:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y + (2 * yChange), facing: middleDirectinon };
                break;
              case 4:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y + (4 * yChange), facing: middleDirectinon };
                break;
              case 5:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y + (6 * yChange), facing: middleDirectinon };
                break;
              case 6:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              case 7:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              case 8:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: this.direction };
            }
          })
        } else if (this.wheelingStep === 3) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 3:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: this.wheelDirection };
                break;
              case 4:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.wheelDirection };
                break;
              case 5:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (4 * yChange), facing: this.wheelDirection };
                break;
              case 6:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y + (2 * yChange), facing: middleDirectinon };
                break;
              case 7:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y + (4 * yChange), facing: middleDirectinon };
                break;
              case 8:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y + (6 * yChange), facing: middleDirectinon };
                break;
              case 9:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              case 10:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              case 11:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y, facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.wheelDirection };
            }
          })
        } else if (this.wheelingStep === 4) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 6:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: this.wheelDirection };
                break;
              case 7:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.wheelDirection };
                break;
              case 8:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (4 * yChange), facing: this.wheelDirection };
                break;
              case 9:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (1 * xChange), y: currentPosition.y + (2 * yChange), facing: middleDirectinon };
                break;
              case 10:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (2 * xChange), y: currentPosition.y + (4 * yChange), facing: middleDirectinon };
                break;
              case 11:
                newDrill[drillIndex[x]] = { x: currentPosition.x + (3 * xChange), y: currentPosition.y + (6 * yChange), facing: middleDirectinon };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.wheelDirection };
            }
          })
        } else if (this.wheelingStep === 5) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              case 9:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (2 * yChange), facing: this.wheelDirection };
                break;
              case 10:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.wheelDirection };
                break;
              case 11:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (4 * yChange), facing: this.wheelDirection };
                break;
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.wheelDirection };
            }
          })
        } else if (this.wheelingStep === 6) {
          drillIndex.forEach((x) => {
            let currentPosition = newDrill[drillIndex[x]];
            switch (x) {
              default:
                newDrill[drillIndex[x]] = { x: currentPosition.x, y: currentPosition.y + (3 * yChange), facing: this.wheelDirection };
            }
          })
        }
      }
        if (this.wheelingStep === 6) {
          this.wheelingStep = 0;
          this.isWheeling = false;
          this.isMarching = true;
          this.direction = this.wheelDirection;
        } else {
          this.wheelingStep++
        }
console.log(newDrill)
    } else {
      newDrill.forEach((memberPosition) => {
        memberPosition.x += newPosition.x;
        memberPosition.y += newPosition.y;
        memberPosition.facing = newPosition.facing;
      })
    }
    this.squadPosition = newDrill;
  }

  getDrillIndex() {
    const newDrill = this.squadPosition.slice();
    let max: Position[] = [];
    let stored: number[] = [];
    let max3: Position = { x: -1, y: -1, facing: undefined };
    let max4: Position = { x: -1, y: -1, facing: undefined };

    switch (this.direction) {
      case 'right':
        for (let i = 0; i < newDrill.length; i++) {
          if (!stored.includes(newDrill[i].y)) {
            stored.push(newDrill[i].y);
            max.push(newDrill[i]);
          }
        }
        max.sort((a, b) => (a.y < b.y ? 1 : -1));
        break;
      case 'left':
        for (let i = 0; i < newDrill.length; i++) {
          if (!stored.includes(newDrill[i].y)) {
            stored.push(newDrill[i].y);
            max.push(newDrill[i]);
          }
        }
        max.sort((a, b) => (a.y > b.y ? 1 : -1));
        break;
      case 'up':
        for (let i = 0; i < newDrill.length; i++) {
          if (!stored.includes(newDrill[i].x)) {
            stored.push(newDrill[i].x);
            max.push(newDrill[i]);
          }
        }
        max.sort((a, b) => (a.x > b.x ? 1 : -1));

        break;
      case 'down':
        for (let i = 0; i < newDrill.length; i++) {
          if (!stored.includes(newDrill[i].x)) {
            stored.push(newDrill[i].x);
            max.push(newDrill[i]);
          }
        }
        max.sort((a, b) => (a.x < b.x ? 1 : -1));
    }

    let file1 = this.direction === 'left' || this.direction === 'right' ? newDrill.filter(x => x.y === max[0].y) : newDrill.filter(x => x.x === max[0].x);
    let file2 = this.direction === 'left' || this.direction === 'right' ? newDrill.filter(x => x.y === max[1].y) : newDrill.filter(x => x.x === max[1].x);
    let file3 = this.direction === 'left' || this.direction === 'right' ? newDrill.filter(x => x.y === max[2].y) : newDrill.filter(x => x.x === max[2].x);
    let file4 = this.direction === 'left' || this.direction === 'right' ? newDrill.filter(x => x.y === max[3].y) : newDrill.filter(x => x.x === max[3].x);

    switch (this.wheelDirection) {
      case 'right':
        file1 = file1.sort((a, b) => (a.y < b.y ? 1 : -1));
        file2 = file2.sort((a, b) => (a.y < b.y ? 1 : -1));
        file3 = file3.sort((a, b) => (a.y < b.y ? 1 : -1));
        file4 = file4.sort((a, b) => (a.y < b.y ? 1 : -1));
        break;
      case 'left':
        file1 = file1.sort((a, b) => (a.y > b.y ? 1 : -1));
        file2 = file2.sort((a, b) => (a.y > b.y ? 1 : -1));
        file3 = file3.sort((a, b) => (a.y > b.y ? 1 : -1));
        file4 = file4.sort((a, b) => (a.y > b.y ? 1 : -1));
        break;
      case 'up':
        file1 = file1.sort((a, b) => (a.x > b.x ? 1 : -1));
        file2 = file2.sort((a, b) => (a.x > b.x ? 1 : -1));
        file3 = file3.sort((a, b) => (a.x > b.x ? 1 : -1));
        file4 = file4.sort((a, b) => (a.x > b.x ? 1 : -1));
        break;
      case 'down':
        file1 = file1.sort((a, b) => (a.x < b.x ? 1 : -1));
        file2 = file2.sort((a, b) => (a.x < b.x ? 1 : -1));
        file3 = file3.sort((a, b) => (a.x < b.x ? 1 : -1));
        file4 = file4.sort((a, b) => (a.x < b.x ? 1 : -1));
    }

    let result: number[] = [];
    file1.forEach((x) => {
      result.push(newDrill.indexOf(x));
    })
    file2.forEach((x) => {
      result.push(newDrill.indexOf(x));
    })
    file3.forEach((x) => {
      result.push(newDrill.indexOf(x));
    })
    file4.forEach((x) => {
      result.push(newDrill.indexOf(x));
    })

    this.wheelingDrillIndex = result;
  }

  async sortDrillIndex(file: Position[]): Promise<number[]> {
    const newDrill = this.squadPosition.slice();
    let result: number[] = [];
    file.forEach((x) => {
      result.push(newDrill.indexOf(x));
    })
    return result;
  }

  performWheeling() {

  }
}
