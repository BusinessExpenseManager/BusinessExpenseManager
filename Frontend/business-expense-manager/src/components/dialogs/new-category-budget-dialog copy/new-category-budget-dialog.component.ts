import { Component, OnInit, provideExperimentalZonelessChangeDetection } from '@angular/core';
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
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { PreventDoubleClick } from '../../../directives/prevent-double-click.directive';

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
    PreventDoubleClick,
    NgFor,
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
  error = false;

  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  newCategoryBudgetForm = this.fb.group({
    id: [1, Validators.required],
    businessId: [1, Validators.required],
    categoryName: [null, [Validators.required, Validators.maxLength(15)]],
    budgetAmount: [null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(this.numRegex),
      ],
    ],
  });

  constructor(
    public dialogRef: MatDialogRef<NewCategoryBudgetDialogComponent>,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.categories = [{id: 0, name: 'Default Category!'}];
    this.getCategories();
    // this.checkAvailableCategories();
  }

  public onSubmit(): void {
    if (this.newCategoryBudgetForm.valid) {
      // create request
      const form = this.newCategoryBudgetForm.getRawValue();
      const tempCategory = form.categoryName as any as Category;
      const budget = form.budgetAmount as any as number
      const request: CreateCategoryBudgetDto = {
        categoryId: tempCategory?.id,
        monthlyBudget: budget,
      };
      this.categoryService.addCategoryBudget(request).subscribe({
        next: (response) => {
          if (response.success) {
             this.dialogRef.close(true);
             this.snackBar.open('Catergory Budget added successfully', 'Ok', {
              duration: 4000,
            });
          }
        }
      });
      return;
    }

    this.snackBar.open('Form still has errors', 'X', { duration: 4000 });
  }

  private getCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.error = false;
          this.categories = response.data;
          this.getCategoryBudgets();
        }
      },
      error: (err) => {
        this.error = true;
      },
    });
  }

  private getCategoryBudgets() {
    this.categoryService.getAllCategoryBudgets(1).subscribe({
      next: (response) => {
        if (response.success) {
          this.categoryBudgets = response.data;
          this.checkAvailableCategories()
        }
      },
      error: (err) => {
        this.error = true;
        this.snackBar.open(
          'An error has occurred fetching the Categories.',
          'X',
          { duration: 4000 }
        );
      },
    });
  }

  public checkAvailableCategories() {

    let categoryNamesFromCategoryBudgets: string[] = [];

    this.categoryBudgets.forEach((categoryBudget) => {
      categoryNamesFromCategoryBudgets.push(categoryBudget.category);
    });

    this.availableCategories = this.categories.filter(
      (category) => !categoryNamesFromCategoryBudgets.includes(category.name)
    );
  }
}
