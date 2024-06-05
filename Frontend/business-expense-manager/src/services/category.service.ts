import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Category} from "../models/category.model";
import {Observable, of} from "rxjs";
import {ApiResponse} from "../models/api-response.model";
import { CreateCategoryBudgetDto } from '../dtos/create-category-budget.dto';
import { CategoryBudget } from '../models/category-budget.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getAllCategories() : Observable<ApiResponse<Category[]>> {
    const tempCategory: Category = {id: 1, name: 'Savings'}
    return of({
      success: true,
      data: [{
        id: 2,
        name: 'Investments'
      },
      { id: 3,
        name: 'Expenses1'
      }]
    })
    return this
      .httpClient
      .get<ApiResponse<Category[]>>(`${this.baseUrl}/category`);
  }

  getAllCategoryBudgets() : Observable<ApiResponse<CategoryBudget[]>> {

    const tempCategory: Category = {id: 1, name: 'Savings'}
    return of({
      success: true,
      data: [{
        category: tempCategory,
        budget: 10000,
      }]
    })
    return this
      .httpClient
      .get<ApiResponse<Category[]>>(`${this.baseUrl}/categorybudgets`);
  }

  addCategoryBudget(categoryBudget: CreateCategoryBudgetDto) : Observable<ApiResponse<number>> {
    return this
      .httpClient
      .post<ApiResponse<CreateCategoryBudgetDto>>(`${this.baseUrl}/categorybudgets/add`, categoryBudget)

    }
}
