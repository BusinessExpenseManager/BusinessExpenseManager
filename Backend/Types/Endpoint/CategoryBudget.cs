namespace Backend.Types.Endpoint;

public record CategoryBudget(
    int Id,
    int BusinessId,
    int CategoryId,
    string MonthlyBudget
);