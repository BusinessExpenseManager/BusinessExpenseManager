import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from "../../components/card/card.component";
import { Card } from '../../entities/BEMEntities';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-view-goals-page',
    standalone: true,
    templateUrl: './view-goals-page.component.html',
    styleUrl: './view-goals-page.component.css',
    imports: [MatIconModule, CardComponent, NgFor]
})
export class ViewGoalsPageComponent implements OnInit {

  public progressCard: Card = {
    title: 'Dishwasher',
    balanceAmount: 5400,
    goalAmount: 7000,
    type: 'Goal',
    colour: 'Yellow'
  }
  public completedCard: Card = {
    title: 'Generator',
    balanceAmount: 10000,
    goalAmount: 10000,
    type: 'Goal',
    colour: 'Yellow'
  }

  public cards: Card[] = [];
  public inProgressCards: Card[] = [];
  public completedCards: Card[] = [];

  public setCards(): void {
    // get goals or categories from DB
    // filter is that of 'Goal' 

    this.cards.push(this.progressCard);
    this.cards.push(this.progressCard);
    this.cards.push(this.completedCard);

    this.inProgressCards = this.cards.slice(0,2);
    this.completedCards = this.cards.slice(2,3);

  }

  ngOnInit(): void {
    this.setCards();
  }

}
