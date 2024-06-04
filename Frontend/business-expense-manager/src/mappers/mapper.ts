import {MonetaryFlow} from "../models/monetary-flow.model";
import {CreateCashFlowDto} from "../dtos/create-cash-flow.dto";
import { Goal } from "../models/goal.model";

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
  return apiResponse.map(item => ({
    id: item.goalId,
    name: item.goalName,
    description: item.goalDescription,
    goalMonetaryValue: item.goalMonetaryValue,
    goalDueDatetime: item.goalDueDatetime,
    createdDatetime: item.createdDatetime,
    
  }));
}
