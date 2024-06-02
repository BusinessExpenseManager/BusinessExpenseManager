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
  error: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);

  isMobile: boolean = false;

  constructor(
    public dialog: MatDialog,
    private monetaryFlowService: MonetaryFlowService
  ) {}

  ngOnInit() {
    this.monetaryFlowService.getCashFlowsForBusiness()
      .subscribe({
        next: value => {
          this.dataSource = new MatTableDataSource<MonetaryFlow>(value);
          this.error = false;
        },
        error: err => {
          this.error = true;
          console.error(err)
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
