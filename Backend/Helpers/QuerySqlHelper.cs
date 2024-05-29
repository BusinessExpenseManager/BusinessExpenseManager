using Backend.Types;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Helpers;

public static class QuerySqlHelper
{
    public static async Task<JsonHttpResult<ApiMessage<T>>> RunSqlQuery<T>(ILogger logger, string message,
        Func<Task<T>> func)
    {
        var result = await func.TryInvokeAsync();
        var apiMessage = ResponseHelper.QueryResultMapper(result, message, StatusCodes.Status500InternalServerError);
        if (apiMessage.SystemError.GetValue(out var error)) logger.LogError(error, "Error occured from run sql: ");
        return TypedResults.Json(apiMessage.ApiMessage, statusCode: apiMessage.StatusCode);
    }
}