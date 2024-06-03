namespace Backend.Types.Endpoint;

public record Goal(
    int Id,
    string Name,
    string Description,
    decimal MonetaryValue,
    DateTime DueDatetime,
    DateTime CreatedDatetime);