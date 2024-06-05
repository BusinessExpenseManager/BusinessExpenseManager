import { Category } from "./category.model";

export interface CategoryBudget {
  id: number;
  category: Category | string;
  budget: number;
}
