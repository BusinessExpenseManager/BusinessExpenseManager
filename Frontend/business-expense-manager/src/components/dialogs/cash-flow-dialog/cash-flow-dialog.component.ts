import {Component, OnInit} from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatSelectModule} from "@angular/material/select";
import {DecimalPipe, NgIf} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {CategoryService} from "../../../services/category.service";
import {Category} from "../../../models/category.model";
import {MonetaryFlowService} from "../../../services/monetary-flow.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MonetaryFlow} from "../../../models/monetary-flow.model";
import {MatButtonModule} from "@angular/material/button";
import {GoalService} from "../../../services/goal.service";
import {Goal} from "../../../models/goal.model";


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
    ReactiveFormsModule,
    MatIcon,
    DecimalPipe,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './cash-flow-dialog.component.html',
  styleUrl: './cash-flow-dialog.component.css'
})
export class CashFlowDialogComponent implements OnInit {

  categories: Category[] = []
  goals: Goal[] = []
  canAddGoal: boolean = false;

  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  cashFlowForm = this.fb.group({
    id: [1, Validators.required],
    date: [new Date(), Validators.required],
    cashFlowType: ['income', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01), Validators.pattern(this.numRegex)]],
    category: ['', Validators.required],
    goal: [undefined],
  });

  GoalCategories : string[] = ['savings'];

  constructor(
    public dialogRef: MatDialogRef<CashFlowDialogComponent>,
    private fb: FormBuilder,
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
        error: err => {
          this.snackBar.open('An error has occurred fetching the Goals.', 'X', {"duration": 4000});
        },
      });
  }

  onSubmit() {
    if (this.cashFlowForm.valid) {
      // create request
      const form = this.cashFlowForm.getRawValue();
      const amount = form.cashFlowType === 'expense' && form.amount ? form.amount * -1 : form.amount

      const request: MonetaryFlow = {
        id: form.id as number,
        goal: form.goal,
        category: form.category as string,
        monetaryValue: amount as number,
        createdDatetime: form.date as Date,
      }

      this.monetaryFlowService.addCashFlow(request)

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

}
