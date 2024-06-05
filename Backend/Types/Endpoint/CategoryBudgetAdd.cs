namespace Backend.Types.Endpoint;

public record CategoryBudgetAdd(
    int CategoryId,
    int MonthlyBudget
);