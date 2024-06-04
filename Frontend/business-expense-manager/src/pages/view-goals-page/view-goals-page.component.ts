import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../../components/card/card.component';
import { Card } from '../../models/card.model';
import { Goal } from '../../models/goal.model';
import { NgFor } from '@angular/common';
import { NewGoalDialogComponent } from '../../components/dialogs/new-goal-dialog/new-goal-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GoalService } from '../../services/goal.service';
import { GoalPanelComponent } from '../../components/goal-panel/goal-panel.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-view-goals-page',
  standalone: true,
  templateUrl: './view-goals-page.component.html',
  styleUrl: './view-goals-page.component.css',
  imports: [MatIconModule, CardComponent, NgFor],
})
export class ViewGoalsPageComponent implements OnInit {
  public progressCard: Card = {
    title: 'Dishwasher',
    balanceAmount: 5400,
    goalAmount: 7000,
    type: 'Goal',
    colour: 'Yellow',
  };
  public completedCard: Card = {
    title: 'Generator',
    balanceAmount: 10000,
    goalAmount: 10000,
    type: 'Goal',
    colour: 'Blue',
  };

  public businessId: number = 0;

  public cards: Card[] = [];
  public inProgressCards: Card[] = [];
  public completedCards: Card[] = [];
  public goalData: Goal[] = [];

  public currentBalance: number = 0;
  public error: boolean = false;
  public page: number = 1;

  constructor(
    public dialog: MatDialog,
    private goalService: GoalService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.retrieveGoals();

    // this.goalService.getAllGoalsForBusiness(this.businessId).subscribe({
    //   next: (value) => {
    //     this.goalData = value as Goal[];
    //     this.error = false;
    //   },
    //   error: (err) => {
    //     this.error = true;
    //     console.error(err);
    //   },
    // });

    // this.goalService.getTotalOfCashflows(this.businessId).subscribe({
    //   next: (value) => {
    //     this.currentBalance = value;
    //     this.error = false;
    //   },
    //   error: (err) => {
    //     this.error = true;
    //     console.error(err);
    //   },
    // });
    // this.setCards(this.goalData);
  }

  retrieveGoals(){
    this.goalService.getAllGoals(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.goalData = response.data;

          if (this.goalData.length === 0) {
            this.snackBar.open(
              'An error has occurred fetching the Goals.',
              'X',
              { duration: 4000 }
            );
          }
        } else {
          const errorMessage =
            response.message ??
            'There are no goals associated with your business. Please create a goal first.';
          this.snackBar.open(errorMessage, 'X', { duration: 4000 });
        }
      },
      error: () => {
        this.snackBar.open('An error has occurred fetching the Goals.', 'X', {
          duration: 4000,
        });
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.retrieveGoals();
  }

  public setCards(goals: Goal[]): void {
    // get goals or categories from DB
    // filter is that of 'Goal'

    // this.goals.foreach( (goal) => {

    // })

    this.cards.push(this.progressCard);
    this.cards.push(this.progressCard);
    this.cards.push(this.progressCard);
    this.cards.push(this.completedCard);

    this.inProgressCards = this.cards.slice(0, 3);
    this.completedCards = this.cards.slice(3, 4);
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
    });
    console.log('goal clicked');
    console.log(card);
  }
}
