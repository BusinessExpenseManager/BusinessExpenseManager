using System.Data;
using Backend.Helpers;
using Backend.Types;
using Backend.Types.Endpoint;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;


namespace Backend.Api;

public class CategoryEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/category");

        group.MapGet("/", GetAllCategories);
    }

    // Assuming that we won't need pagination for categories.
    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Category>>>> GetAllCategories(
        ILogger<Program> logger,
        IDbConnection connection) =>
        ResponseHelper.RunSqlQuery(logger, "Unable to get all categories",
            async () => await connection.QueryAsync<Category>("SELECT id, name FROM categories;"));
}