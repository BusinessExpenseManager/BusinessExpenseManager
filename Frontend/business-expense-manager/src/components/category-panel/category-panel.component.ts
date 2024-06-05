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
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-panel',
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
    MatButtonModule,
  ],
  templateUrl: './category-panel.component.html',
  styleUrl: './category-panel.component.css',
})
export class CategoryPanelComponent implements OnInit, AfterViewInit {
  public cashflows: MonetaryFlow[] = [];
  displayedColumns: string[] = ['Date Captured', 'Category', 'Amount'];
  dataSource = new MatTableDataSource<MonetaryFlow[]>();

  public categoryCard: Card;
  public categoryBudgetId: number = -1;
  public deleteError = false;

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );

  public error = false;
  public loading = true;
  public page = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialog: MatDialogRef<any>,
    private monetaryFlowService: MonetaryFlowService,
    private categoryService: CategoryService,
    private goalService: GoalService,
    private snackBar: MatSnackBar
  ) {
    this.categoryCard = data;
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

  public deleteBudget(): void {
    this.categoryBudgetId = this.categoryCard.id;
    console.log('Deleting budget goal!');

    console.log('deleting category budget:', this.categoryBudgetId);

    this.categoryService
      .deleteCategoryBudget(this.categoryBudgetId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.deleteError = false;
            this.snackBar.open('Goal deleted', 'Ok', {
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
          console.log("Cashflows retrieved:", this.dataSource);
        }
      },
      error: (err) => {
        this.error = true;
        
      },
    });
  }
}
