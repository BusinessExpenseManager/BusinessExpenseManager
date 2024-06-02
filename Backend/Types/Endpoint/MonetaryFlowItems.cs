namespace Backend.Types.Endpoint;

public record MonetaryFlowItems(
    int FlowId,
    string GoalName,
    string CategoryName,
    decimal MonetaryValue,
    DateTime CreatedDatetime);