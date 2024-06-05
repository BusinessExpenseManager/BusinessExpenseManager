using System.Data.Common;
using Backend.Helpers;
using Backend.Types;
using Backend.Types.Endpoint;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class CategoryEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/category");

        group.MapGet("/", GetAllCategories);
    }

    // Categories are used just for a lookup table so no need to pass in user id
    // It will be in a dropdown so no need for pagination.
    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Category>>>> GetAllCategories(
        ILogger<Program> logger,
        DbDataSource source) =>
        source.RunSqlQuery(logger, "Unable to get all categories",
            con => con.QueryAsync<Category>("SELECT id, name FROM categories;"));
}