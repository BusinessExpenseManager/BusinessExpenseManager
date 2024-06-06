using System.Data;
using System.Data.Common;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class CategoryBudgetEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/categorybudgets");
        group.MapGet("/", GetPagedCategoryBudget);
        group.MapPost("/add", AddCategoryBudget);
    }

    private static Task<JsonHttpResult<ApiMessage<int>>> AddCategoryBudget(
        ILogger<Program> logger,
        DbDataSource source,
        CategoryBudgetAdd budgetAdd,
        ICognitoService cognito) =>
        source.RunSqlQuery(logger, "Unable to add budget category", con => con.QuerySingleAsync<int>(
            "SELECT * FROM add_budget_category(@UserCognitoIdentifier, @CategoryId, CAST(@MonthlyBudget AS MONEY));",
            new DynamicParameters(budgetAdd).MergeObject(cognito.Get())
        ));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<CategoryBudget>>>> GetPagedCategoryBudget(
        ILogger<Program> logger,
        DbDataSource source,
        PagingData pageData,
        ICognitoService cognito) =>
        source.RunSqlQuery(logger, "Unable to get paged category budgets", con =>
            con.QueryAsync<CategoryBudget>(
                "SELECT  c.id AS Id, cat.Name AS Name, c.category_id as CategoryId, monthly_budget as MonthlyBudget, SUM(mf.monetary_value) AS Mon FROM category_budgets as c LEFT JOIN businesses b on c.business_id = b.id LEFT JOIN categories cat on c.category_id = cat.id LEFT JOIN monetary_flows mf on cat.id = mf.category_id WHERE b.user_cognito_identifier = @UserCognitoIdentifier group by monthly_budget, c.category_id, c.id, cat.Name Limit 10 OFFSET @PageOffset;",
                new DynamicParameters(pageData).MergeObject(cognito.Get())
            ));
}