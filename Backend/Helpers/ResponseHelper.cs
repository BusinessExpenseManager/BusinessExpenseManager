using System.Data.Common;
using Backend.Types;
using DotNext;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Helpers;

public static class ResponseHelper
{
    private static ApiMessageWrapper<T> QueryResultMapper<T>(Result<T> result, string errorMessage, int errorCode)
    {
        return result.Convert(ApiMessageWrapper<T>.SuccessResult)
            .OrInvoke(e => ApiMessageWrapper<T>.FailureResult(errorMessage, errorCode, e));
    }

    public static async Task<JsonHttpResult<ApiMessage<T>>> RunSqlQuery<T>(this DbDataSource source, ILogger logger,
        string message, Func<DbConnection, Task<T>> func)
    {
        var openConnection = source.CreateConnection();
        var result = await func.TryInvokeAsync(openConnection);
        var apiMessage = QueryResultMapper(result, message, StatusCodes.Status500InternalServerError);
        if (apiMessage.SystemError.GetValue(out var error)) logger.LogError(error, "Error occured from run sql: ");
        var jsonHttpResult = TypedResults.Json(apiMessage.ApiMessage, statusCode: apiMessage.StatusCode);

        // Flip this kill the connections, but they idle for a bit so when we have many connections that are just idle we know why.
        await openConnection.CloseAsync();
        await openConnection.DisposeAsync();
        return jsonHttpResult;
    }
}