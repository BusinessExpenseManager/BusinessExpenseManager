namespace Backend.Types.Endpoint;

public record CategoryBudget(
    int Id,
    string Name,
    int CategoryId,
    decimal MonthlyBudget,
    decimal Mon
);