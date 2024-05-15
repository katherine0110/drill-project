import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Position } from '../position';
import { CommonModule } from '@angular/common';
import { squadDirection } from "../squadDirection";

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
  @Input() direction!: squadDirection;

  cellStatus: 'cell' | 'food' | 'snake' | 'snake-head' = 'cell';
  isDown = false;
  isLeft = false;
  isRight = false;
  isUp = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.drillPosition || !changes['drillPosition']){
      return;
    }else{
      const change = changes['drillPosition'].currentValue;
      this.drillPosition = change;
    }

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

    this.isDown = this.drillPosition.some(
      (member) => member.x == cellX && member.y == cellY && member.facing === 'down'
    );
    this.isLeft = this.drillPosition.some(
      (member) => member.x == cellX && member.y == cellY && member.facing === 'left'
    );
    this.isRight = this.drillPosition.some(
      (member) => member.x == cellX && member.y == cellY && member.facing === 'right'
    );
    this.isUp = this.drillPosition.some(
      (member) => member.x == cellX && member.y == cellY && member.facing === 'up'
    );
  }
}