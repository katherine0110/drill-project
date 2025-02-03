import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Position, squadDirection } from '../common/squad-util';
import { CommonModule } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-cell',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent implements AfterViewInit, OnChanges {
  @Input() cell!: Position;
  @Input() squadPosition!: Position[];
  @Input() direction!: squadDirection;
  @Input() isPlacing: boolean = false;
  @Output() clickCell: EventEmitter<Position> = new EventEmitter();
  
  @ViewChild('boardCell') boardCell!: ElementRef
  clickedElement: Subscription = new Subscription();

  cellStatus: 'cell' | 'food' | 'snake' | 'snake-head' = 'cell';

  ngAfterViewInit(): void {    
    this.clickedElement = fromEvent(this.boardCell.nativeElement, 'click').subscribe((event) => {
      if (this.isPlacing) {
        this.clickCell.emit(this.cell)
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.squadPosition || !changes['squadPosition']){
      return;
    }else{
      const change = changes['squadPosition'].currentValue;
      this.squadPosition = change;
    }

    const cellX = this.cell.x;
    const cellY = this.cell.y;
    this.cell.facing = this.squadPosition.filter((member) => member.x === cellX && member.y === cellY)[0]?.facing??'up';

    const isSnake = this.squadPosition.some(
      (snake) => snake.x == cellX && snake.y == cellY
    );
    const isSnakeHead =
      this.squadPosition[0].x == cellX && this.squadPosition[0].y == cellY;

    if (isSnake) {
      this.cellStatus = 'snake';
    } else {
      this.cellStatus = 'cell';
    }
    if (isSnakeHead) {
      this.cellStatus = 'snake-head';
    }
  }
}