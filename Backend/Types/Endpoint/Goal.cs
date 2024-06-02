namespace Backend.Types.Endpoint;

public record Goal(
    int Id,
    string Name,
    string Description,
    decimal GoalMonetaryValue,
    DateTime GoalDueDatetime,
    DateTime CreatedDatetime);