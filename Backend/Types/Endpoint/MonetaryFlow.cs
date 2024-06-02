namespace Backend.Types.Endpoint;

public record MonetaryFlow(
    int Id,
    int BusinessId,
    int GoalId,
    int CategoryId,
    decimal MonetaryValue,
    DateTime CreatedDatetime);