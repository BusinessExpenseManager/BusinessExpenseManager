namespace Backend.Types.Endpoint;

public record CategoryBudget(
    int Id,
    int CategoryId,
    string MonthlyBudget
);