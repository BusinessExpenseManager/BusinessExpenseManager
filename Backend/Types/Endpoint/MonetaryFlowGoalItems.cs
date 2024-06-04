namespace Backend.Types.Endpoint;

public record MonetaryFlowGoalItems(
    int GoalId,
    string Name,
    decimal MonetaryValue,
    decimal GoalValue
);