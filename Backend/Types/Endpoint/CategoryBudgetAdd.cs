namespace Backend.Types.Endpoint;

public record CategoryBudgetAdd(
    int CategoryId,
    decimal MonthlyBudget
);