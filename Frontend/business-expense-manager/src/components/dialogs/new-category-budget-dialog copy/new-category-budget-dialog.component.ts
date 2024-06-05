import { Component, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { DecimalPipe, NgIf } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { MonetaryFlowService } from '../../../services/monetary-flow.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MonetaryFlow } from '../../../models/monetary-flow.model';
import { MatButtonModule } from '@angular/material/button';
import { GoalService } from '../../../services/goal.service';
import { Goal } from '../../../models/goal.model';
import { CreateGoalDto } from '../../../dtos/create-goal.dto';
import { CreateCategoryBudgetDto } from '../../../dtos/create-category-budget.dto';
import { CategoryBudget } from '../../../models/category-budget.model';

@Component({
  selector: 'app-new-category-budget-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    NgIf,
    ReactiveFormsModule,
    MatIcon,
    DecimalPipe,
    MatButtonModule,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './new-category-budget-dialog.component.html',
  styleUrl: './new-category-budget-dialog.component.css',
})
export class NewCategoryBudgetDialogComponent implements OnInit {
  categories: Category[] = [];
  categoryBudgets: CategoryBudget[] = [];
  availableCategories: Category[] = [];
  selectedCategory: Category | undefined;
  goals: string[] = [];
  canAddGoal: boolean = false;

  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  newCategoryBudgetForm = this.fb.group({
    id: [1, Validators.required],
    businessId: [1, Validators.required],
    categoryName: ['', [Validators.required, Validators.maxLength(15)]],
    budgetAmount: [
      1,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(this.numRegex),
      ],
    ],
  });

  // GoalCategories: string[] = ['savings'];

  constructor(
    public dialogRef: MatDialogRef<NewCategoryBudgetDialogComponent>,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.checkAvailableCategories();
    // this.categoryService.getAllCategories().subscribe({
    //   next: (response) => {
    //     this.categories = response;
    //   },
    // });
  }

  public onSubmit(): void {
    if (this.newCategoryBudgetForm.valid) {
      // create request
      const form = this.newCategoryBudgetForm.getRawValue();

      const request: CreateCategoryBudgetDto = {
        categoryName: form.categoryName as string,
        budgetAmount: form.budgetAmount as number,
      };

      this.categoryService.addCategoryBudget(request);

      return;
    }

    this.snackBar.open('Form still has errors', 'X', { duration: 4000 });
  }

  private getCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        } else {
          const errorMessage =
            response.message ?? 'An error has occurred fetching the Categories';
          this.snackBar.open(errorMessage, 'X', { duration: 4000 });
        }
      },
      error: (err) => {
        this.snackBar.open(
          'An error has occurred fetching the Categories.',
          'X',
          { duration: 4000 }
        );
      },
    });
  }

  private getCategoryBudgets() {
    this.categoryService.getAllCategoryBudgets().subscribe({
      next: (response) => {
        if (response.success) {
          this.categoryBudgets = response.data;
        } else {
          const errorMessage =
            response.message ?? 'An error has occurred fetching the Categories';
          this.snackBar.open(errorMessage, 'X', { duration: 4000 });
        }
      },
      error: (err) => {
        this.snackBar.open(
          'An error has occurred fetching the Categories.',
          'X',
          { duration: 4000 }
        );
      },
    });
  }

  public checkAvailableCategories() {
    this.getCategories();
    this.getCategoryBudgets();
    let categoriesFromCategoryBudgets: Category[] = []; 
    console.log("Budgets:", this.categoryBudgets);
    this.categoryBudgets.forEach((categoryBudget) => {
      categoriesFromCategoryBudgets.push(categoryBudget.category as Category);
    })

    console.log(this.categories);
    console.log(categoriesFromCategoryBudgets);

    this.availableCategories = this.categories.filter((category) => !categoriesFromCategoryBudgets.includes(category));
  }
}
