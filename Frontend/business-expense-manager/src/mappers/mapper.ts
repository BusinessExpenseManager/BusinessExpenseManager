import {MonetaryFlow} from "../models/monetary-flow.model";

export function mapMonetaryFlow(apiResponse: any[]): MonetaryFlow[] {
  return apiResponse.map(item => ({
    id: item.flowId,
    goal: item.goalName,
    category: item.categoryName,
    monetaryValue: item.monetaryValue,
    createdDatetime: new Date(item.createdDatetime)
  }));
}
