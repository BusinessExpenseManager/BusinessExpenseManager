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
    return this
      .httpClient
      .get<ApiResponse<Category[]>>(`${this.baseUrl}/category`);
  }

}
