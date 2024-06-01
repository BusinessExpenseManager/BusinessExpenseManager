using System.Data;
using Backend.Model.Domain;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using static Backend.Helpers.QuerySqlHelper;

namespace Backend.Api;

public static class CategoryBudgetEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/categorybudgets");
        group.MapGet("/", GetPagedCategoryBudget);
        group.MapPut("/add", AddCategoryBudget);
    }

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<CategoryBudget>>>> AddCategoryBudget(
        ILogger<Program> logger,
        IDbConnection connection,
        CategoryBudgetAdd budgetAdd) =>
        RunSqlQuery(logger, "Unable to add budget category",
            () => connection.QueryAsync<CategoryBudget>(
                "INSERT INTO category_budgets(business_id, category_id, monthly_budget) VALUES (@BusinessId, @CategoryId, @MonthlyBudget);",
                budgetAdd));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<CategoryBudget>>>> GetPagedCategoryBudget(
        ILogger<Program> logger,
        IDbConnection connection,
        PagingData pageData) =>
        RunSqlQuery(logger, "Unable to get paged category budgets",
            () => connection.QueryAsync<CategoryBudget>("SELECT * FROM category_budgets Limit 10 OFFSET @PageOffset;",
                pageData));
}