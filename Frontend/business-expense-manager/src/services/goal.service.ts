import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {ApiResponse} from "../models/api-response.model";
import {Category} from "../models/category.model";
import {Goal} from "../models/goal.model";

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getAllGoals() : Observable<ApiResponse<Goal[]>> {
    return this
      .httpClient
      .get<ApiResponse<Category[]>>(`${this.baseUrl}/goal`);
  }
}
