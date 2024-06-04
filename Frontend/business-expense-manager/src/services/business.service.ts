import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApiResponse} from "../models/api-response.model";
import {Business} from "../models/business.model";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  registerBusiness(business: Business) : Observable<ApiResponse<number>> {
    return this
      .httpClient
      .post<ApiResponse<number>>(`${this.baseUrl}/business`, business);
  }
}
