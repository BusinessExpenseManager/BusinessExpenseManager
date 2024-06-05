import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Category } from '../models/category.model';
import { Goal } from '../models/goal.model';
import { mapGoals } from '../mappers/mapper';
import { CreateGoalDto } from '../dtos/create-goal.dto';
import { DeleteGoalDto } from '../dtos/delete-goal.dto';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getAllGoals(page: number): Observable<ApiResponse<Goal[]>> {
    return this
      .httpClient
      .get<ApiResponse<Goal[]>>(`${this.baseUrl}/goal?page=${page}`)
      .pipe(
        map(response => {
          if (response.success) {
            response.data = mapGoals(response.data);
          }
          return response;
        })
      );
  }

  // getAllGoalsForBusiness(businessId: number): Observable<Goal[]> {
  //   return of([
  //     {
  //       id: 1,
  //       name: 'Washing machine',
  //       description: 'I want to afford a washing machine by Christmas',
  //       goalCurrentValue: 1000,
  //       goalTargetValue: 1200,
  //       goalDueDatetime: new Date(),
  //       createdDatetime: new Date(),
  //     },
  //     {
  //       id: 1,
  //       name: 'New staff member',
  //       description: 'I want to afford a new admin staff member by Christmas',
  //       goalCurrentValue: 6000,
  //       goalTargetValue: 1200,
  //       goalDueDatetime: new Date(),
  //       createdDatetime: new Date(),
  //     },
  //   ]);
  // }

  // getTotalOfCashflows(businessId: number): Observable<number> {
  //   return of(5643);
  // }

  addGoal(goal: CreateGoalDto): Observable<ApiResponse<number>> {
      return this
        .httpClient
        .post<ApiResponse<Goal>>(`${this.baseUrl}/goal/add`, goal)
  }

  deleteGoal(goalId: number): Observable<ApiResponse<number>> {
    return this.httpClient.delete<ApiResponse<number>>(
      `${this.baseUrl}/goal/delete/${goalId}`
    );
  }
}
