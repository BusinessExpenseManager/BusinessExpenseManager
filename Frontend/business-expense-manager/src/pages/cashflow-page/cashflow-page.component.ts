import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule} from "@angular/material/paginator";
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
  error: boolean = false;
  loading: boolean = true;

  constructor(
    public dialog: MatDialog,
    private monetaryFlowService: MonetaryFlowService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getCashFlows();
  }

  onPageChange(event: any) {
    let page = 1
    if (event?.pageIndex) {
      page = event.pageIndex + 1;
    }

    this.getCashFlows(page)
  }

  getCashFlows(page: number = 1) {
    this.error = false;
    this.monetaryFlowService.getCashFlowsForBusiness(page)
      .subscribe({
        next: response => {

          if (response.success) {
            this.dataSource = new MatTableDataSource<MonetaryFlow>(response.data);
            this.loading = false;
          } else {
            const errorMessage = response.message ?? 'An error has occurred fetching the cash flow'
            this.snackBar.open(errorMessage, 'X', {"duration": 4000});
            this.error = true;
          }
        },
        error: err => {
          this.error = true;
          this.snackBar.open('An error has occurred fetching the cash flow.', 'X', {"duration": 4000});
        },
      })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteCashFlow(id: number) {
    // Confirm Deletion
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms'
    });

    dialogRef.componentInstance.confirmMessage = 'Are you sure you delete the cash flow record?';

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Delete Record
        this.monetaryFlowService
          .deleteCashFlow(id)
          .subscribe((response: any) => {
            console.log(response);
            // TODO: Refresh Cash Flow Table if successfully deleted
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
  }
}
