import { DatePipe, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
  ],
  templateUrl: './goal-panel.component.html',
  styleUrl: './goal-panel.component.css',
})
export class GoalPanelComponent implements OnInit, AfterViewInit {
  public cashflows: MonetaryFlow[] = [];
  displayedColumns: string[] = ['Date Captured', 'Category', 'Amount'];
  dataSource = new MatTableDataSource<MonetaryFlow[]>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );

  public error = false;
  public loading = false;
  public page = 1;

  constructor(
    @Optional() private dialog: MatDialogRef<any>,
    private monetaryFlowService: MonetaryFlowService,
    private goalService: GoalService,
    private snackBar: MatSnackBar
  ) {}

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
    console.log('Deleting goal!');
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
        } else {
          const errorMessage =
            response.message ?? 'An error has occurred fetching the cash flow';
          this.snackBar.open(errorMessage, 'X', { duration: 4000 });
          this.error = true;
        }
      },
      error: (err) => {
        this.error = true;
        this.snackBar.open(
          'An error has occurred fetching the cash flow.',
          'X',
          { duration: 4000 }
        );
      },
    });
  }
}
