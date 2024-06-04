export interface CreateGoalDto {
  name: string;
  description: string;
  monetary_value: number;
  due_datetime: Date;
}
