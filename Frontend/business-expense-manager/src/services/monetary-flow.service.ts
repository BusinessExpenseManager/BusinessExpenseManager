import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of} from "rxjs";
import {environment} from "../../environment";
import {MonetaryFlow} from "../models/monetary-flow.model";
import {ApiResponse} from "../models/api-response.model";
import {mapMonetaryFlow} from "../mappers/mapper";
import {CreateCashFlowDto} from "../dtos/create-cash-flow.dto";

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

  deleteCashFlow(cashFlowId: number): Observable<ApiResponse<number>> {
    return this
      .httpClient
      .delete<ApiResponse<MonetaryFlow[]>>(`${this.baseUrl}/monetary_flow/delete/${cashFlowId}`)
  }


  addCashFlow(cashFlow: CreateCashFlowDto): Observable<ApiResponse<number>> {
    return this
      .httpClient
      .post<ApiResponse<MonetaryFlow[]>>(`${this.baseUrl}/monetary_flow/add`, cashFlow)

  }

}
