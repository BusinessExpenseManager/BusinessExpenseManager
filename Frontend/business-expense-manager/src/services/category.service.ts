import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Category} from "../models/category.model";
import {Observable, of} from "rxjs";
import {ApiResponse} from "../models/api-response.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getAllCategories() : Observable<ApiResponse<Category[]>> {
    this
      .httpClient
      .get<ApiResponse<Category[]>>(`${this.baseUrl}/category`);

    return of({
      success: true,
      data: [
        {id: 1, name: 'Entertainment'},
        {id: 1, name: 'Investments'},
        {id: 1, name: 'Travel'},
        {id: 1, name: 'Savings'}
      ]
    });

  }

}
