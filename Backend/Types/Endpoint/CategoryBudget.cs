namespace Backend.Model.Domain;

public record CategoryBudget(
    int Id,
    int BusinessId,
    int CategoryId,
    string MonthlyBudget
);

public record CategoryBudgetAdd(
    int BusinessId,
    int CategoryId,
    int MonthlyBudget
);