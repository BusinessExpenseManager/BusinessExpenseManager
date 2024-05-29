namespace Backend.Model.Domain;

public record MonetaryFlow(
    int Id,
    int BusinessId,
    int GoalId,
    int CategoryId,
    decimal MonetaryValue,
    DateTime CreatedDatetime);

public record MonetaryFlowAdd(
    int BusinessId,
    int GoalId,
    int CategoryId,
    decimal MonetaryValue);