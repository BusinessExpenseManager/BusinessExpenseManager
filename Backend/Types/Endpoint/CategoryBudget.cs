namespace Backend.Types.Endpoint;

public record CategoryBudget(
    int Id, int CategoryId, decimal MonthlyBudget
);