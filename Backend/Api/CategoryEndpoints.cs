using System.Data;
using Backend.Model.Domain;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using static Backend.Helpers.QuerySqlHelper;


namespace Backend.Api;

public static class CategoryEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/category");

        group.MapGet("/", GetAllCategories);
    }

    // Assuming that we won't need pagination for categories.
    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Category>>>> GetAllCategories(
        ILogger<Program> logger,
        IDbConnection connection) =>
        RunSqlQuery(logger, "Unable to get all categories",
            () => connection.QueryAsync<Category>("SELECT id, name FROM categories;"));
}