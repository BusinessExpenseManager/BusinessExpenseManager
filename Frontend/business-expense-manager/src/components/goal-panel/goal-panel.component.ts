import { DatePipe, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from '../card/card.component';
import { MonetaryFlow } from '../../models/monetary-flow.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MonetaryFlowService } from '../../services/monetary-flow.service';
import { Goal } from '../../models/goal.model';
import { GoalService } from '../../services/goal.service';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSortHeader, MatSortModule } from '@angular/material/sort';
import { Card } from '../../models/card.model';
import { DeleteGoalDto } from '../../dtos/delete-goal.dto';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-goal-panel',
  standalone: true,
  imports: [
    MatIconModule,
    CardComponent,
    NgFor,
    NgIf,
    MatTableModule,
    DatePipe,
    MatPaginatorModule,
    MatSortHeader,
    MatSortModule,
    MatIconButton,
    MatButton,
  ],
  templateUrl: './goal-panel.component.html',
  styleUrl: './goal-panel.component.css',
})
export class GoalPanelComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );

  public cashflows: MonetaryFlow[] = [];
  public displayedColumns: string[] = ['Date Captured', 'Category', 'Amount'];
  public dataSource = new MatTableDataSource<MonetaryFlow[]>();
  public error = false;
  public deleteError = false;
  public loading = true;
  public page = 1;
  public goalCard: Card;
  private goalId: number = -1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialog: MatDialogRef<any>,
    private monetaryFlowService: MonetaryFlowService,
    private goalService: GoalService,
    private snackBar: MatSnackBar
  ) {
    this.goalCard = data;
    console.log("gc:", this.goalCard);
  }

  ngOnInit() {
    this.getCashFlows();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public onPageChange(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.getCashFlows();
  }

  public close(): void {
    this.dialog.close();
  }

  public deleteGoal(): void {

    this.goalId = this.goalCard.id;

    console.log("Attemping to delete goal:", this.goalId);
    this.goalService.deleteGoal(this.goalId).subscribe({
      next: (response) => {
        if (response.success) {
          this.deleteError = false;
          this.snackBar.open('Goal deleted', 'X', {
            duration: 4000,
          });
          this.dialog.close;
        }
      },
      error: (err) => {
        this.deleteError = true;
      },
    });
  }

  public getCashFlows() {
    this.error = false;
    this.monetaryFlowService.getCashFlowsForBusiness(this.page).subscribe({
      next: (response) => {
        if (response.success) {
          this.dataSource = new MatTableDataSource<MonetaryFlow[]>(
            response.data
          );
          this.loading = false;
          this.error = false;
        }
      },
      error: (err) => {
        this.error = true;
      },
    });
  }
}
