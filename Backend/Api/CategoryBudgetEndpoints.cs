using System.Data;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public class CategoryBudgetEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/categorybudgets");

        // group.MapGet("/", GetAllCategories);
    }


    /*private static async Task<JsonHttpResult<ApiMessage<IEnumerable<CategoryBudget>>>> GetAllCategories(
        ILogger<Program> logger, IDbConnection connection)
    {
        return await RunSqlQuery(logger, "Unable to get all categories", Func);
        Task<IEnumerable<CategoryBudget>> Func() => connection.QueryAsync<CategoryBudget>("SELECT * FROM category_budget;");
    }*/
}