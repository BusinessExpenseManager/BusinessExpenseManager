import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from '../../models/card.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [NgFor, NgIf, MatProgressSpinnerModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {

  @Input() card: Card = {
    title: 'Default',
    balanceAmount: 5400,
    goalAmount: 7700,
    type: 'Goal',
    colour: 'Yellow'
  };

  @Output() goalClicked = new EventEmitter<Card>();

  constructor() {}

  get progressAmount() : number {
    return (this.card.balanceAmount / this.card.goalAmount) * 100;
  }

  get progressAmountString() : string {
    let temp = (this.card.balanceAmount / this.card.goalAmount) * 100;
    if(temp === 100) {
      return "100.0";
    }
    return temp.toFixed(2);
  }

  public emitCardClickedEvent(){
    this.goalClicked.emit(this.card);
  }

}
