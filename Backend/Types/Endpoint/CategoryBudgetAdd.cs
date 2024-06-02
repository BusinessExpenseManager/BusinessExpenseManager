namespace Backend.Types.Endpoint;

public record CategoryBudgetAdd(
    int BusinessId,
    int CategoryId,
    int MonthlyBudget
);