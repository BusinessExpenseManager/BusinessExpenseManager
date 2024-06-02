import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of} from "rxjs";
import {environment} from "../../environment";
import {MonetaryFlow} from "../models/monetary-flow.model";
import {ApiResponse} from "../models/api-response.model";
import {mapMonetaryFlow} from "../mappers/mapper";

@Injectable({
  providedIn: 'root'
})
export class MonetaryFlowService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getCashFlowsForBusiness(page: number): Observable<ApiResponse<MonetaryFlow[]>> {
    return this
      .httpClient
      .get<ApiResponse<MonetaryFlow[]>>(`${this.baseUrl}/monetary_flow?page=${page}`)
      .pipe(
        map(response => {
          if (response.success) {
            response.data = mapMonetaryFlow(response.data)
          }
          return response;
        })
      );
  }

  deleteCashFlow(id: number): Observable<string> {
    return of('');
    // return this.httpClient.delete<string>(`${this.url}/${id}`);
  }


  addCashFlow(cashflow: MonetaryFlow): Observable<string> {
    return of('');
  }

}
