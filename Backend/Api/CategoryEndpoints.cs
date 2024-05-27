using System.Data;
using Backend.Helpers;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class CategoryEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/category");
        // Assuming that we won't need pagination for categories.
        group.MapGet("/", GetAllCategories);
    }

    private static async Task<JsonHttpResult<ApiMessage<IEnumerable<Category>>>> GetAllCategories(
        ILogger<Program> logger, IDbConnection connection)
    {
        var func = Task<IEnumerable<Category>> () => connection.QueryAsync<Category>("select * from Category;");
        var result = await func.TryInvokeAsync();
        var apiMessageWrapper = ResponseHelper.QueryResultMapper(result, "Unable to get all Categories",
            StatusCodes.Status500InternalServerError);

        if (apiMessageWrapper.SystemError.HasValue)
            logger.LogError(apiMessageWrapper.SystemError.Value, "Get all transactions Failed: ");
        return TypedResults.Json(apiMessageWrapper.ApiMessage, statusCode: apiMessageWrapper.StatusCode);
    }
}