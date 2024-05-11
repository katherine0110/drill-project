import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CellComponent } from './cell/cell.component';
import { Position } from './position';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

type MoveDirection = 'left' | 'right' | 'up' | 'down';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CellComponent, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  score = 0;
  gridSizeX = 36;
  gridSizeY = 80;
  interval = 500;
  cells: Position[] = [];
  drillPosition = [
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 },
    { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 },
    { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 },
    { x: this.gridSizeX / 2 + 9, y: this.gridSizeY / 2 },
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 + 2 },
    { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 + 2 },
    { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 + 2 },
    { x: this.gridSizeX / 2 + 9, y: this.gridSizeY / 2 + 2 },
    { x: this.gridSizeX / 2, y: this.gridSizeY / 2 + 4 },
    { x: this.gridSizeX / 2 + 3, y: this.gridSizeY / 2 + 4 },
    { x: this.gridSizeX / 2 + 6, y: this.gridSizeY / 2 + 4 },
    { x: this.gridSizeX / 2 + 9, y: this.gridSizeY / 2 + 4 },
  ];

  direction: MoveDirection = 'up';
  isMarching = false;
  
  templateColumnStyle = new Array(this.gridSizeY).fill('1fr').join(' ');

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
        this.cells.push({ x: row, y: col });
      }
    }
  }

  updateGame() {
    let xChange = 0;
    let yChange = 0;
    
    const newDrill = this.drillPosition.slice();
    let canUpdate = true;
    
    if(this.isMarching){
      switch (this.direction) {
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
      newDrill.forEach((memberPosition) => {
        const newX = memberPosition.x + xChange;
        const newY = memberPosition.y + yChange;
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
    }


    if (canUpdate && this.isMarching) {
      
      newDrill.forEach((memberPosition) => {
        memberPosition.x += xChange;
        memberPosition.y += yChange;
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
  
  changeDirection(newDirection: string){
    if(newDirection == 'right'){
      switch (this.direction) {
        case 'right':
          this.direction = 'down';
          break;
        case 'left':
          this.direction = 'up';
          break;
        case 'up':
          this.direction = 'right';
          break;
        case 'down':
          this.direction = 'left';
      }
    }else if(newDirection == 'left'){
      switch (this.direction) {
        case 'right':
          this.direction = 'up';
          break;
        case 'left':
          this.direction = 'down';
          break;
        case 'up':
          this.direction = 'left';
          break;
        case 'down':
          this.direction = 'right';
      }
    }else if(newDirection == 'about'){
      switch (this.direction) {
        case 'right':
          this.direction = 'left';
          break;
        case 'left':
          this.direction = 'right';
          break;
        case 'up':
          this.direction = 'down';
          break;
        case 'down':
          this.direction = 'up';
      }
    }
  }
}
