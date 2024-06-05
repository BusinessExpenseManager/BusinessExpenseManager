import {MonetaryFlow} from "../models/monetary-flow.model";
import {CreateCashFlowDto} from "../dtos/create-cash-flow.dto";
import { Goal, GoalNameOnly } from "../models/goal.model";
import { CategoryBudget } from "../models/category-budget.model";

export function mapMonetaryFlow(apiResponse: any[]): MonetaryFlow[] {
  return apiResponse.map(item => ({
    id: item.flowId,
    goal: item.goalName,
    category: item.categoryName,
    monetaryValue: item.monetaryValue,
    createdDatetime: new Date(item.createdDatetime)
  }));
}

export function mapGoals(apiResponse: any[]): Goal[] {
  console.log("Api response:", apiResponse);
  return apiResponse.map((item) => ({
    id: item.goalId,
    name: item.goalName,
    description: item.goalDescription,
    goalCurrentValue: item.goalCurrentValue,
    goalTargetValue: item.goalMonetaryValue,
    goalDueDatetime: new Date(item.goalDueDatetime),
    createdDatetime: new Date(item.createdDatetime),
    
  }));
}

export function mapGoalNames(apiResponse: any[]): GoalNameOnly[] {
  console.log("Api response:", apiResponse);
  return apiResponse.map((item) => ({
    id: item.id,
    name: item.name,
  }));
}

export function mapCategoryBudget(apiResponse: any[]): CategoryBudget[] {
  console.log("Api response catBudg:", apiResponse);
  return apiResponse.map((item) => ({
    id: item.id,
    category: item.name,
    balance: item.mon,
    monthlyBudget: item.monthlyBudget
  }));
}
