import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Category} from "../models/category.model";
import {Observable} from "rxjs";
import {ApiResponse} from "../models/api-response.model";
import { CreateCategoryBudgetDto } from '../dtos/create-category-budget.dto';

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

  addCategoryBudget(categoryBudget: CreateCategoryBudgetDto) : Observable<ApiResponse<number>> {
    return this
      .httpClient
      .post<ApiResponse<CreateCategoryBudgetDto>>(`${this.baseUrl}/monetary_flow/add`, categoryBudget)

    }
}
