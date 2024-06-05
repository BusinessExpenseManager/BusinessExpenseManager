import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSortHeader, MatSortModule} from '@angular/material/sort';
import {MatDialog,} from '@angular/material/dialog';
import {MonetaryFlow} from "../../models/monetary-flow.model";
import {ConfirmDialogComponent} from "../../components/dialogs/confirm-dialog/confirm-dialog.component";
import {MonetaryFlowService} from "../../services/monetary-flow.service";
import {DatePipe, NgIf} from "@angular/common";
import {CashFlowDialogComponent} from "../../components/dialogs/cash-flow-dialog/cash-flow-dialog.component";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-cashflow-page',
  standalone: true,
  imports: [
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortHeader,
    MatSortModule,
    NgIf,
    DatePipe,
    MatButtonModule
  ],
  templateUrl: './cashflow-page.component.html',
  styleUrl: './cashflow-page.component.css'
})
export class CashflowPageComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['Date Captured', 'Category', 'Goal', 'Amount', 'Delete'];
  dataSource = new MatTableDataSource<MonetaryFlow>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  isMobile: boolean = false;

  constructor(
    public dialog: MatDialog,
    private monetaryFlowService: MonetaryFlowService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getCashFlows();
  }

  page: number = 1
  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.getCashFlows();
  }

  error: boolean = false;
  loading: boolean = true;
  getCashFlows() {
    this.error = false;
    this.monetaryFlowService.getCashFlowsForBusiness(this.page)
      .subscribe({
        next: response => {
          if (response.success) {
            this.dataSource = new MatTableDataSource<MonetaryFlow>(response.data);
            this.loading = false;
          } else {
            this.error = true;
          }
        },
        error: () => {
          this.error = true;
        },
      })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteCashFlow(CashFlowId: number) {
    // Confirm Deletion
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms'
    });

    dialogRef.componentInstance.confirmMessage = 'Are you sure you delete the cash flow record?';

    dialogRef.afterClosed().subscribe(confirmation => {
      if (confirmation === true) {
        // Delete
        this.monetaryFlowService
          .deleteCashFlow(CashFlowId)
          .subscribe({
            next: response => {
              if (response.success) {
                this.snackBar.open('Successfully deleted record.', 'Ok', {"duration": 4000});
                this.getCashFlows();
              }
            },
          })
      }
    });
  }

  addCashFlow() {
    const dialogRef = this.dialog.open(CashFlowDialogComponent, {
      width: '35%',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms'
    });

    dialogRef.afterClosed().subscribe(saved => {
      if (saved) {
        this.getCashFlows()
      }
    })
  }
}
