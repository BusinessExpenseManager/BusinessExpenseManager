import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../../components/card/card.component';
import { Card } from '../../models/card.model';
import { Goal } from '../../models/goal.model';
import { NgFor, NgIf } from '@angular/common';
import { NewGoalDialogComponent } from '../../components/dialogs/new-goal-dialog/new-goal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GoalService } from '../../services/goal.service';
import { GoalPanelComponent } from '../../components/goal-panel/goal-panel.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {MatButton} from "@angular/material/button";
import {PreventDoubleClick} from "../../directives/prevent-double-click.directive";

@Component({
  selector: 'app-view-goals-page',
  standalone: true,
  templateUrl: './view-goals-page.component.html',
  styleUrl: './view-goals-page.component.css',
  imports: [MatIconModule, CardComponent, NgFor, MatPaginatorModule, MatButton, NgIf, PreventDoubleClick],
})
export class ViewGoalsPageComponent implements OnInit {
  public progressCard: Card = {
    id: 1,
    title: 'Dishwasher',
    description: 'I need a dishwasher, to wash dishes',
    balanceAmount: 5400,
    goalAmount: 7000,
    type: 'Goal',
    colour: 'Blue',
  };
  public completedCard: Card = {
    id: 2,
    title: 'Generator',
    balanceAmount: 10000,
    goalAmount: 10000,
    type: 'Goal',
    colour: 'Green',
  };
  public expiredCard: Card = {
    id: 3,
    title: 'Covid-19 vaccine',
    balanceAmount: 180,
    goalAmount: 100000,
    type: 'Goal',
    colour: 'Red',
  };

  public businessId: number = 0;

  public cards: Card[] = [];
  public inProgressCards: Card[] = [];
  public completedCards: Card[] = [];
  public expiredCards: Card[] = [];
  public goalData: Goal[] = [];

  public currentBalance: number = 0;
  public error = false;
  public loading = true;
  public newCard: Card = {
    id: 3,
    title: 'Covid-19 vaccine',
    balanceAmount: 180,
    goalAmount: 100000,
    type: 'Goal',
    colour: 'Red',
  };

  constructor(
    public dialog: MatDialog,
    private goalService: GoalService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.retrieveGoals();
    this.setCards();

  }

  isLastPage: boolean = false;
  retrieveGoals(nextPage: boolean = false){

    this.goalService.getAllGoals(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.isLastPage = !response.data.length;
          if (nextPage && this.isLastPage) {
            this.page--;
            this.snackBar.open('On Last Page.', 'Ok', {"duration": 4000});
            return;
          }

          this.goalData = response.data;
          this.loading = false;
          this.error = false;
          this.setCards(); // TODO: set setCards with goalData properly + should work now
        }
      },
      error: () => {
        this.error = true;
      },
    });
  }

  public setCards(): void {

    this.cards = [];
    this.goalData.forEach((goal) => {
      const balanceAmount = goal.goalCurrentValue; // change to proper val
      const goalAmount = goal.goalTargetValue;


      const colour = (balanceAmount >= goalAmount ? 'Green': 'Yellow');

      this.newCard = {
        id: goal.id,
        title: goal.name,
        description: goal.description,
        balanceAmount: goal.goalCurrentValue,
        goalAmount: goal.goalTargetValue,
        type: 'Goal',
        colour: colour,
      }

      this.cards.push(this.newCard);
      if(this.newCard.colour === 'Yellow'){
        this.inProgressCards.push(this.newCard);
      }
      else if(this.newCard.colour === 'Green'){
        this.completedCards.push(this.newCard);
      }
      if(this.newCard.colour === 'Red'){
        this.expiredCards.push(this.newCard);
      }
    });

  }

  public addNewGoal(): void {
    const dialogRef = this.dialog.open(NewGoalDialogComponent, {
      width: '35%',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
  }

  public showGoalClicked(card: Card): void {
    this.dialog.open(GoalPanelComponent, {
      panelClass: 'fullscreen-overlay-side-panel',
      disableClose: true,
      width: '50%',
      minWidth: '380px',
      data: card,
    });
  }

  page: number = 1
  previousPage() {
    if (this.page === 1) {
      this.snackBar.open('On First Page.', 'Ok', {"duration": 4000});
      return;
    }

    this.page--;
    this.retrieveGoals()
  }

  nextPage() {
    this.page++;
    this.retrieveGoals(true)
  }

}
