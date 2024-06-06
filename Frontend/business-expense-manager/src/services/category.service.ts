import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable, map, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { CreateCategoryBudgetDto } from '../dtos/create-category-budget.dto';
import { CategoryBudget } from '../models/category-budget.model';
import { mapCategoryBudget } from '../mappers/mapper';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.httpClient.get<ApiResponse<Category[]>>(
      `${this.baseUrl}/category`
    ); // with /name means not paginated
  }

  getAllCategoryBudgets(page: number): Observable<ApiResponse<CategoryBudget[]>> {
    return this.httpClient.get<ApiResponse<CategoryBudget[]>>(
      `${this.baseUrl}/categorybudgets?page=${page}`
    ).pipe(
      map((response) => {
        if (response.success) {
          response.data = mapCategoryBudget(response.data);
        }
        return response;
      })
    );
  }

  addCategoryBudget(
    categoryBudget: CreateCategoryBudgetDto
  ): Observable<ApiResponse<number>> {
    return this.httpClient.post<ApiResponse<number>>(
      `${this.baseUrl}/categorybudgets/add`,
      categoryBudget
    );
  }

  deleteCategoryBudget(
    categoryBudgetId: number
  ): Observable<ApiResponse<number>> {
    return this.httpClient.delete<ApiResponse<number>>(
      `${this.baseUrl}/categorybudgets/delete/${categoryBudgetId}`
    );
  }
}
