using System.Data;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public class CategoryBudgetEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/categorybudgets");
        group.MapGet("/", GetPagedCategoryBudget);
        group.MapPost("/add", AddCategoryBudget);
    }

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<CategoryBudget>>>> AddCategoryBudget(
        ILogger<Program> logger,
        IDbConnection connection,
        CategoryBudgetAdd budgetAdd,
        ICognitoService cognito) =>
        ResponseHelper.RunSqlQuery(logger, "Unable to add budget category",
            () => connection.QueryAsync<CategoryBudget>(
                "INSERT INTO category_budgets(business_id, category_id, monthly_budget) VALUES (@BusinessId, @CategoryId, @MonthlyBudget);",
                new DynamicParameters(budgetAdd).MergeObject(cognito.Get())
            ));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<CategoryBudget>>>> GetPagedCategoryBudget(
        ILogger<Program> logger,
        IDbConnection connection,
        PagingData pageData,
        ICognitoService cognito) =>
        ResponseHelper.RunSqlQuery(logger, "Unable to get paged category budgets",
            () => connection.QueryAsync<CategoryBudget>("SELECT * FROM category_budgets Limit 10 OFFSET @PageOffset;",
                new DynamicParameters(pageData).MergeObject(cognito.Get())
            ));
}