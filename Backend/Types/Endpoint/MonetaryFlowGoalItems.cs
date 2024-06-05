namespace Backend.Types.Endpoint;

public record MonetaryFlowGoalItems(
    int GoalId,
    string GoalName,
    string GoalDescription,
    decimal GoalCurrentValue,
    decimal GoalMonetaryValue,
    DateTime CreatedDatetime,
    DateTime GoalDueDatetime
);