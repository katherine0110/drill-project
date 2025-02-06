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
  @Input() goalPosition!: Position[];
  @Input() direction!: squadDirection;
  @Input() isPlacing: boolean = false;
  @Input() isGoalPlacing: boolean = false;
  @Output() clickCell: EventEmitter<Position> = new EventEmitter();
  
  @ViewChild('boardCell') boardCell!: ElementRef
  clickedElement: Subscription = new Subscription();

  cellStatus: 'cell' | 'food' | 'squad' | 'marker' | 'goal' | 'goalMarker' = 'cell';

  ngAfterViewInit(): void {    
    this.clickedElement = fromEvent(this.boardCell.nativeElement, 'click').subscribe((event) => {
      if (this.isPlacing || this.isGoalPlacing) {
        this.clickCell.emit(this.cell)
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((!this.squadPosition || !changes['squadPosition']) && (!this.goalPosition || this.goalPosition.length !== 12 || !changes['goalPosition'])) {
      return;
    } else {
      const cellX = this.cell.x;
      const cellY = this.cell.y;

      if (this.squadPosition) {
        if (changes['squadPosition']) {
          const change = changes['squadPosition'].currentValue;
          this.squadPosition = change;
        }
        
        const isSquad = this.squadPosition.some(
          (squad) => squad.x == cellX && squad.y == cellY
        );
        const isSquadMarker =
          this.squadPosition[0].x == cellX && this.squadPosition[0].y == cellY;
        
        if (this.cellStatus !== 'goal' && this.cellStatus !== 'goalMarker') {
          this.cell.facing = this.squadPosition.filter((member) => member.x === cellX && member.y === cellY)[0]?.facing??'up';
          if (isSquad) {
            this.cellStatus = 'squad';
          } else {
            this.cellStatus = 'cell';
          }
          if (isSquadMarker) {
            this.cellStatus = 'marker';
          }
        } else {
          if (isSquad) {
            this.cellStatus = 'squad';
          }
          if (isSquadMarker) {
            this.cellStatus = 'marker';
          }
        }
      }

      if (this.goalPosition && this.goalPosition.length === 12) {
        if (changes['goalPosition']) {
          const change = changes['goalPosition'].currentValue;
          this.goalPosition = change;
        }
  
        const isGoal = this.goalPosition.some(
          (squad) => squad.x == cellX && squad.y == cellY
        );
        const isGoalMarker =
          this.goalPosition[0].x == cellX && this.goalPosition[0].y == cellY;
  
        if (this.cellStatus !== 'squad' && this.cellStatus !== 'marker') {
          this.cell.facing = this.goalPosition.filter((member) => member.x === cellX && member.y === cellY)[0]?.facing??'up';
          if (isGoal) {
            this.cellStatus = 'goal';
          } else {
            this.cellStatus = 'cell';
          }
          if (isGoalMarker) {
            this.cellStatus = 'goalMarker';
          }
        }
      }
    }
  }
}