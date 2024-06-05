import { Category } from "./category.model";

export interface CategoryBudget {
  id: number;
  category: string;
  balance: number,
  monthlyBudget: number;
}
