import {Component, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CardComponent} from '../../components/card/card.component';
import {Card} from '../../models/card.model';
import {Goal} from '../../models/goal.model';
import {NgFor, NgIf} from '@angular/common';
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
import { CategoryBudget } from '../../models/category-budget.model';

@Component({
  selector: 'app-view-categories-page',
  standalone: true,
  templateUrl: './view-categories-page.component.html',
  styleUrl: './view-categories-page.component.css',
    imports: [MatIconModule, CardComponent, NgFor, MatPaginatorModule, MatButton, NgIf],
})
export class ViewCategoriesPageComponent implements OnInit {
  public categoryCard: Card = {
    id: 1,
    title: 'Savings',
    balanceAmount: 90000,
    goalAmount: 100000,
    type: 'Category',
    colour: 'Blue',
  };


  public businessId: number = 0;

  public numCategories: number = 20;
  public categoryBudgetData: CategoryBudget[] = [];
  public loading = true;
  public isReturnEmpty = false;

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

    this.retrieveCategoryBudgets();
    this.setCards();

  }

  retrieveCategoryBudgets(){


    this.categoryService.getAllCategoryBudgets(1).subscribe({
      next: (response) => {
        if (response.success) {
          this.categoryBudgetData = response.data;
          this.loading = false;
          this.error = false;

          if(this.categoryBudgetData.length === 0){
            this.error = true;
            this.isReturnEmpty = true;
          }
          this.setCards(); // TODO: set setCards with categoryBudget data properly
        }
      },
      error: () => {
        this.error = true;
      },
    });

  }

  public setCards(): void {

    this.categoryCards = this.categoryBudgetData.map(catBudget => {

      const balanceAmount = Math.abs(catBudget.balance); // change to proper val
      const goalAmount = catBudget.monthlyBudget;

      const colour = balanceAmount > goalAmount ? 'Red' : 'Blue';

      return {
        id: catBudget.id,
        title: catBudget.category,
        balanceAmount: catBudget.balance,
        goalAmount: catBudget.monthlyBudget,
        type: 'Category',
        colour: balanceAmount >= goalAmount ? 'Orange' : 'Blue',
      };
    });

    this.categoryCards = this.categoryCards.slice(0, this.numCategories);
  }

  public addCategoryBudget(): void {
    const dialogRef = this.dialog.open(NewCategoryBudgetDialogComponent, {
      width: '35%',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });

    dialogRef.afterClosed().subscribe(confirmation => {
      if (confirmation === true) {
        this.retrieveCategoryBudgets();
      }
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
