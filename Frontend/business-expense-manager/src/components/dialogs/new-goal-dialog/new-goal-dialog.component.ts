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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { MonetaryFlowService } from '../../../services/monetary-flow.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MonetaryFlow } from '../../../models/monetary-flow.model';
import { MatButtonModule } from '@angular/material/button';
import { GoalService } from '../../../services/goal.service';
import { Goal } from '../../../models/goal.model';

@Component({
  selector: 'app-new-goal-dialog',
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
  templateUrl: './new-goal-dialog.component.html',
  styleUrl: './new-goal-dialog.component.css',
})
export class NewGoalDialogComponent implements OnInit {
  categories: Category[] = [];
  goals: string[] = [];
  canAddGoal: boolean = false;

  numRegex = /^-?\d*[.,]?\d{0,2}$/;
  newGoalForm = this.fb.group({
    id: [1, Validators.required],
    businessId: [1, Validators.required],
    goalName: ['', [Validators.required, Validators.maxLength(15)]],
    goalDescription: ['', [Validators.required, Validators.maxLength(150)]],
    dueDate: [new Date(), Validators.required],
    amount: [
      0,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(this.numRegex),
      ],
    ],
  });

  // GoalCategories: string[] = ['savings'];

  constructor(
    public dialogRef: MatDialogRef<NewGoalDialogComponent>,
    private fb: FormBuilder,
    private goalService: GoalService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // this.categoryService.getAllCategories().subscribe({
    //   next: (response) => {
    //     this.categories = response;
    //   },
    // });
  }

  public onSubmit(): void {
    if (this.newGoalForm.valid) {
      // create request
      const form = this.newGoalForm.getRawValue();

      const request: Goal = {
        id: form.id as number,
        name: form.goalName as string,
        description: form.goalDescription as string,
        goalDueDatetime: form.dueDate as Date,
        createdDatetime: new Date(),
        goalMonetaryValue: form.amount as number,
      };

      this.goalService.addGoal(request);

      return;
    }

    this.snackBar.open('Form still has errors', 'X', { duration: 4000 });
  }
}
