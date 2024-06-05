export interface Goal {
  id: number;
  name: string;
  description: string;
  goalCurrentValue: number;
  goalTargetValue: number;
  createdDatetime: Date;
  goalDueDatetime: Date;
}
