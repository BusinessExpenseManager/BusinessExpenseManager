export interface Goal {
  id: number;
  name: string;
  description: string;
  goalCurrentValue: number;
  goalTargetValue: number;
  createdDatetime: Date;
  goalDueDatetime: Date;
}

export interface GoalNameOnly {
  id: number;
  name: string;
}
