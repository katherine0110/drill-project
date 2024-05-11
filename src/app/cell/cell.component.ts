import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Position } from '../position';
import { CommonModule } from '@angular/common';

type MoveDirection = 'left' | 'right' | 'up' | 'down';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent implements OnChanges {
  @Input() cell!: Position;
  @Input() drillPosition!: Position[];
  @Input() direction!: MoveDirection;

  cellStatus: 'cell' | 'food' | 'snake' | 'snake-head' = 'cell';
  isDown = false;
  isLeft = false;
  isRight = false;
  isUp = false;

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['drillPosition'].currentValue;
    if (!change) return;
    this.drillPosition = change;

    const cellX = this.cell.x;
    const cellY = this.cell.y;

    const isSnake = this.drillPosition.some(
      (snake) => snake.x == cellX && snake.y == cellY
    );
    const isSnakeHead =
      this.drillPosition[0].x == cellX && this.drillPosition[0].y == cellY;

    if (isSnake) {
      this.cellStatus = 'snake';
    } else {
      this.cellStatus = 'cell';
    }
    if (isSnakeHead) {
      this.cellStatus = 'snake-head';
    }
    
    this.isDown = this.direction === 'down';
    this.isLeft = this.direction === 'left';
    this.isRight = this.direction === 'right';
    this.isUp = this.direction === 'up';
  }
}