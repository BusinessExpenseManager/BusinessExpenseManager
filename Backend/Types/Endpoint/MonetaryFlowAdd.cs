namespace Backend.Types.Endpoint;

public record MonetaryFlowAdd(
    int GoalId,
    int CategoryId,
    decimal MonetaryValue);