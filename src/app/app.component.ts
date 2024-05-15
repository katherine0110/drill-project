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
  gridSizeX = 36;
  gridSizeY = 80;
  interval = 500;
  cells: Position[] = [];

  Directions: squadDirection[] = ['up', 'right', 'down', 'left', 'up', 'right', 'down'];
  markerPosition: Position = { x: this.gridSizeX / 2, y: this.gridSizeY / 2, facing: 'up'};
  // drillPosition = [
  //   { x: this.gridSizeX / 2, y: this.gridSizeY / 2 },
  //   { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 },
  //   { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 },
  //   { x: this.gridSizeX / 2 + 9, y: this.gridSizeY / 2 },
  //   { x: this.gridSizeX / 2, y: this.gridSizeY / 2 + 2 },
  //   { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 + 2 },
  //   { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 + 2 },
  //   { x: this.gridSizeX / 2 + 9, y: this.gridSizeY / 2 + 2 },
  //   { x: this.gridSizeX / 2, y: this.gridSizeY / 2 + 4 },
  //   { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 + 4 },
  //   { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 + 4 },
  //   { x: this.gridSizeX / 2 + 9, y: this.gridSizeY / 2 + 4 },
  // ];
  drillPosition: Position[] = [
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2, facing: 'up' },
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 + 3, facing: 'up' },
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 + 6, facing: 'up' },
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 + 9, facing: 'up' },
    { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2, facing: 'up' },
    { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 + 3, facing: 'up' },
    { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 + 6, facing: 'up' },
    { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 + 9, facing: 'up' },
    { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2, facing: 'up' },
    { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 + 3, facing: 'up' },
    { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 + 6, facing: 'up' },
    { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 + 9, facing: 'up' },
  ];

  stepDirectionList = [
    { label: 'Step Forward', value: 'forward'},
    { label: 'Step Back', value: 'back'},
    { label: 'Right Close', value: 'right'},
    { label: 'Left Close', value: 'left'}
  ];
  selectedStepDirection = '';
  numOfStep = 0;
  inputNumOfStep = 0;
  isStepping = false;
  steppingDirection: squadDirection = undefined;

  direction: squadDirection = 'up';
  isMarching = false;
  isInline = true;
  
  templateColumnStyle = new Array(this.gridSizeY).fill('1fr').join(' ');

  constructor(private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.generateBoard();
    // determine number of columns for styles
    
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

  generateSquad(forming: string){
    if(forming === 'lineFacingUp'){

    }
    this.drillPosition
  }

  updateGame() {
    const newDrill = this.drillPosition.slice();
    let canUpdate = true;
    let newPosition: Position;
    
    if(this.isMarching || this.isStepping){
      newPosition = this.calculateMoving(this.isMarching ? this.direction : this.steppingDirection, this.direction);
      newDrill.forEach((memberPosition) => {
        const newX = memberPosition.x + newPosition.x;
        const newY = memberPosition.y + newPosition.y;

        if (
          newX >= this.gridSizeX ||
          newX < 0 ||
          newY >= this.gridSizeY ||
          newY < 0
        ) {
          canUpdate = false;
          return;
        }
      })

      if(this.numOfStep === 0){
        this.inputNumOfStep = 0;
        this.isStepping = false
      }else{
        this.numOfStep--;
      }
    }

    if ((canUpdate && this.isMarching) || this.isStepping) {
      newDrill.forEach((memberPosition) => {
        memberPosition.x += newPosition.x;
        memberPosition.y += newPosition.y;
        memberPosition.facing = newPosition.facing;
        if (
          memberPosition.x >= this.gridSizeX ||
          memberPosition.x < 0 ||
          memberPosition.y >= this.gridSizeY ||
          memberPosition.y < 0
        ) {
          canUpdate = false;
          return;
        }
      })
      this.drillPosition = newDrill;
    }else{
      this.drillPosition = newDrill;
    }
  }

  calculateMoving(movingDirection: squadDirection, facingDirection: squadDirection): Position{
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
    return {x: xChange, y: yChange, facing: facingDirection};
  }
  
  changeDirection(newDirection: string){
    const newDrill = this.drillPosition.slice();
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
    this.drillPosition = newDrill;
  }

  stepping(){
    if(this.selectedStepDirection.length === 0 || this.inputNumOfStep === 0){
      this.confirmationService.confirm({
        message: 'Please complete the Stepping command!',
        rejectVisible: false,
        acceptLabel: 'OK',
      })
    }else{
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
        if(canUpdate){
          this.isStepping = true;
          this.numOfStep = this.inputNumOfStep;
        }else{
          this.confirmationService.confirm({
            message: 'Not enough space!',
            rejectVisible: false,
            acceptLabel: 'OK',
          })
        }
      })

    }
  }

  async determineCanMove(numOfStep: number, newPosition: Position): Promise<boolean>{
    const newDrill = this.drillPosition.slice();
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

  wheeling(wheelDirection: string){

  }
}
