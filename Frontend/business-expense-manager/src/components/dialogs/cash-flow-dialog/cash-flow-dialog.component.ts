import {Component, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from "@angular/material/select";
import {DecimalPipe, NgIf} from "@angular/common";
import {FormsModule, NgForm} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {CategoryService} from "../../../services/category.service";
import {Category} from "../../../models/category.model";
import {MonetaryFlowService} from "../../../services/monetary-flow.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {GoalService} from "../../../services/goal.service";
import {Goal} from "../../../models/goal.model";
import {CreateCashFlowDto} from "../../../dtos/create-cash-flow.dto";
import {finalize} from "rxjs";


@Component({
  selector: 'app-cash-flow-dialog',
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
    MatIcon,
    DecimalPipe,
    MatButtonModule,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './cash-flow-dialog.component.html',
  styleUrl: './cash-flow-dialog.component.css'
})
export class CashFlowDialogComponent implements OnInit {

  expense_types = ['transport', 'interest', 'savings', 'investments', 'stock', 'salaries', 'food', 'insurance', 'utilities', 'training', 'sundry'];
  income_types = ['interest', 'savings', 'investments', 'sales', 'sundry']
  typeError: boolean = false;

  categories: Category[] = []
  goals: Goal[] = []
  canAddGoal: boolean = false;

  numRegex = /^-?\d*[.,]?\d{0,2}$/;

  cashFlow = {
    type: 'income',
    amount: undefined,
    category: undefined as any,
    goal: null,
  }

  GoalCategories : string[] = ['savings'];
  disableSubmit: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CashFlowDialogComponent>,
    private categoryService: CategoryService,
    private goalService: GoalService,
    private monetaryFlowService: MonetaryFlowService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getCategories();
    this.getGoals();
  }

  private getCategories() {
    this.categoryService
      .getAllCategories()
      .subscribe({
        next: response => {
          if (response.success) {
            this.categories = response.data;
          } else {
            const errorMessage = response.message ?? 'An error has occurred fetching the Categories'
            this.snackBar.open(errorMessage, 'X', {"duration": 4000});
          }
        },
        error: err => {
          this.snackBar.open('An error has occurred fetching the Categories.', 'X', {"duration": 4000});
        },
      });
  }

  private getGoals() {
    this.goalService
      .getAllGoals()
      .subscribe({
        next: response => {
          if (response.success) {
            this.goals = response.data;

            if (this.goals.length === 0) {
              this.snackBar.open('An error has occurred fetching the Goals.', 'X', {"duration": 4000});
            }
          } else {
            const errorMessage = response.message ?? 'There are no goals associated with your business. Please create a goal first.'
            this.snackBar.open(errorMessage, 'X', {"duration": 4000});
          }
        },
        error: () => {
          this.snackBar.open('An error has occurred fetching the Goals.', 'X', {"duration": 4000});
        },
      });
  }

  onSubmit(cashFlowForm: NgForm) {
    this.disableSubmit = true;
    if (cashFlowForm.valid && !this.typeError) {
      const request: CreateCashFlowDto = {
        goalId: cashFlowForm.value?.goal?.id ?? null,
        categoryId: cashFlowForm.value?.category?.id,
        monetaryValue: cashFlowForm.value.type == 'income' ? cashFlowForm.value.amount : cashFlowForm.value.amount * -1,
      }

      this.monetaryFlowService.addCashFlow(request)
        .pipe(
          finalize(() => {
            this.disableSubmit = false;
          })
        )
        .subscribe({
          next: response => {
            if (response.success) {
              this.dialogRef.close(true);
            } else {
              const errorMessage = response.message ?? 'An error has occurred saving the cash flow.'
              this.snackBar.open(errorMessage, 'X', {"duration": 4000});
            }
          },
          error: () => {
            this.snackBar.open('An error has occurred saving the cash flow.', 'X', {"duration": 4000});
            this.disableSubmit = false;
          },
        })
      return;
    }

    this.snackBar.open('Form still has errors', 'X', {"duration": 4000});
  }

  checkGoalEligibility(event: any) {
    const category = event?.value?.name;
    if (category) {
      this.canAddGoal = this.GoalCategories.includes(category.toLowerCase());
    }
  }

  checkCategoryCashFlowType(cashFlowForm: NgForm) {
    const category = cashFlowForm.value?.category?.name;
    const cashFlowType = cashFlowForm.value?.type;

    if (!category || !cashFlowType) {
      // haven't picked yet
      return;
    }

    const normalizedCategory = category.toLowerCase();

    if (cashFlowType === 'income') {
      const isIncome = this.income_types.includes(normalizedCategory);
      this.typeError = !isIncome;
    } else {
      const isExpense = this.expense_types.includes(normalizedCategory);
      this.typeError = !isExpense;
    }
  }
}
