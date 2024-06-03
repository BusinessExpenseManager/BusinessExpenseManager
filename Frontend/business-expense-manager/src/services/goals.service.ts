import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable, of } from 'rxjs';
import { Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getAllGoalsForBusiness(businessId: number): Observable<Goal[]> {
    return of([
      { id: 1, name: "Washing machine", description: "I want to afford a washing machine by Christmas", goalMonetaryValue: 10999, goalDueDatetime: new Date(), createdDatetime: new Date()},
      { id: 1, name: "New staff member", description: "I want to afford a new admin staff member by Christmas", goalMonetaryValue: 6000, goalDueDatetime: new Date(), createdDatetime: new Date()},
    ]);
  }

  getTotalOfCashflows(businessId: number): Observable<number> {
    return of(
        5643
    );
  }

  addGoal(goal: Goal): Observable<string> {
    return of('');
  }
}
