import {MonetaryFlow} from "../models/monetary-flow.model";
import {CreateCashFlowDto} from "../dtos/create-cash-flow.dto";

export function mapMonetaryFlow(apiResponse: any[]): MonetaryFlow[] {
  return apiResponse.map(item => ({
    id: item.flowId,
    goal: item.goalName,
    category: item.categoryName,
    monetaryValue: item.monetaryValue,
    createdDatetime: new Date(item.createdDatetime)
  }));
}
