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
    id: item.goal_id,
    name: item.goal_name,
    description: item.goal_description,
    goalCurrentValue: item.goal_current_value,
    goalTargetValue: item.goal_monetary_value,
    goalDueDatetime: new Date(item.goal_due_datetime),
    createdDatetime: new Date(item.created_datetime),
    
  }));
}
