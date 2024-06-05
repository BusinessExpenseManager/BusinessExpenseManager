import {Component, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CardComponent} from '../../components/card/card.component';
import {Card} from '../../models/card.model';
import {Goal} from '../../models/goal.model';
import {NgFor} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {GoalService} from '../../services/goal.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {CategoryService} from '../../services/category.service';
import {CategoryPanelComponent} from '../../components/category-panel/category-panel.component';
import {
  NewCategoryBudgetDialogComponent
} from '../../components/dialogs/new-category-budget-dialog copy/new-category-budget-dialog.component';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-view-categories-page',
  standalone: true,
  templateUrl: './view-categories-page.component.html',
  styleUrl: './view-categories-page.component.css',
    imports: [MatIconModule, CardComponent, NgFor, MatPaginatorModule, MatButton],
})
export class ViewCategoriesPageComponent implements OnInit {
  public categoryCard: Card = {
    title: 'Savings',
    balanceAmount: 90000,
    goalAmount: 100000,
    type: 'Category',
    colour: 'Blue',
  };

  public completedCard: Card = {
    title: 'Generator',
    balanceAmount: 10000,
    goalAmount: 10000,
    type: 'Goal',
    colour: 'Green',
  };
  public expiredCard: Card = {
    title: 'Covid-19 vaccine',
    balanceAmount: 180,
    goalAmount: 100000,
    type: 'Goal',
    colour: 'Red',
  };

  public businessId: number = 0;

  public numCategories: number = 20;

  public categoryCards: Card[] = [];

  public currentBalance: number = 0;
  public error: boolean = false;
  public page: number = 1;

  constructor(
    public dialog: MatDialog,
    private categoryService: CategoryService,
    private goalService: GoalService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.retrieveCategories();
    this.setCards();

  }

  retrieveCategories(){
    return;
    // this.goalService.getAllGoals(this.page).subscribe({
    //   next: (response) => {
    //     if (response.success) {
    //       this.goalData = response.data;

    //       if (this.goalData.length === 0) {
    //         this.snackBar.open(
    //           'An error has occurred fetching the Goals.',
    //           'X',
    //           { duration: 4000 }
    //         );
    //       }

    //       this.setCards();
    //     } else {
    //       const errorMessage =
    //         response.message ??
    //         'There are no goals associated with your business. Please create a goal first.';
    //       this.snackBar.open(errorMessage, 'X', { duration: 4000 });
    //     }
    //   },
    //   error: () => {
    //     this.snackBar.open('An error has occurred fetching the Goals.', 'X', {
    //       duration: 4000,
    //     });
    //   },
    // });
  }

  // onPageChange(event: PageEvent) {
  //   this.page = event.pageIndex + 1;
  //   this.retrieveCategories();
  // }

  public setCards(): void {
    // get goals or categories from DB
    // filter is that of 'Goal'

    // this.goals.foreach( (goal) => {

    // })

    // this.cards = this.goalData.map(goal => {
    //   const balanceAmount = goal.currentMonetaryValue; // change to proper val
    //   const goalAmount = goal.completedAmount;
    //   return {
    //     title: goal.name,
    //     balanceAmount: 0,
    //     goalAmount: goal.goalMonetaryValue,
    //     type: 'Goal',
    //     colour: balanceAmount >= goalAmount ? 'Yellow' : 'Green',
    //   };
    // });

    // temporary, until API working

    this.categoryCards.push(this.categoryCard);
    this.categoryCards = this.categoryCards.slice(0, this.numCategories);
  }

  public addCategoryBudget(): void {
    const dialogRef = this.dialog.open(NewCategoryBudgetDialogComponent, {
      width: '35%',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
  }

  public showCategoryClicked(card: Card): void {
    // CategoryPanelComponent
    this.dialog.open(CategoryPanelComponent, {
      panelClass: 'fullscreen-overlay-side-panel',
      disableClose: true,
      width: '50%',
      minWidth: '380px',
      data: card,
    });
  }
}
