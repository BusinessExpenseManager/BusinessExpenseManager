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
  goals: string[] = []
  canAddGoal: boolean = false;

  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  cashFlowForm = this.fb.group({
    id: [1, Validators.required],
    businessId: [1, Validators.required],
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
    private monetaryFlowService: MonetaryFlowService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.categoryService
      .getAllCategories()
      .subscribe({
        next: response => {
          this.categories = response;
        }
      })
  }

  onSubmit() {
    if (this.cashFlowForm.valid) {
      // create request
      const form = this.cashFlowForm.getRawValue();
      const amount = form.cashFlowType === 'expense' && form.amount ? form.amount * -1 : form.amount

      const request: MonetaryFlow = {
        id: form.id as number,
        businessId: form.businessId as number,
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
