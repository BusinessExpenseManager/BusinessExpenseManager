namespace Backend.Types.Endpoint;

public record MonetaryFlowCatItems(
    int CategoryId,
    string Name,
    decimal Balance,
    decimal MonthlyBudget
);