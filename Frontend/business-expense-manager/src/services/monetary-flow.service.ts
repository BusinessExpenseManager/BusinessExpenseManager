import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../environment";
import {MonetaryFlow} from "../models/monetary-flow.model";

@Injectable({
  providedIn: 'root'
})
export class MonetaryFlowService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  deleteCashFlow(id: number): Observable<string> {
    return of('');
    // return this.httpClient.delete<string>(`${this.url}/${id}`);
  }

  getCashFlowsForBusiness(): Observable<MonetaryFlow[]> {
    // return of([]);
    return of([
      { id: 1, businessId: 1, createdDatetime: new Date('2024-05-31 09:00'), category: 'Groceries', goal: 'N/A', monetaryValue: -1000 },
      { id: 2, businessId: 1, createdDatetime: new Date('2024-05-30 15:30'), category: 'Entertainment', goal: 'N/A', monetaryValue: -500 },
      { id: 3, businessId: 1, createdDatetime: new Date( '2024-05-29 12:45'), category: 'Utilities', goal: 'N/A', monetaryValue: -200 },
      { id: 4, businessId: 1, createdDatetime: new Date('2024-05-30 15:30'), category: 'Coffee', goal: 'N/A', monetaryValue: -58 },
      { id: 5, businessId: 1, createdDatetime: new Date('2024-05-30 15:30'), category: 'Savings', goal: 'Oven', monetaryValue: 500 },
      { id: 6, businessId: 1, createdDatetime: new Date('2024-05-30 15:30'), category: 'Entertainment', goal: 'N/A', monetaryValue: -700 },
    ]);
    // return this.httpClient.get<MonetaryFlow[]>(`${this.url}/${id}`);
  }

  addCashFlow(cashflow: MonetaryFlow): Observable<string> {
    return of('');
  }

}
