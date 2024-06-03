using System.Data;
using System.Data.Common;
using Backend.Types;
using DotNext;
using DotNext.Threading.Tasks;
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
        var result = await source.OpenConnectionAsync().AsTask().Convert(func.TryInvokeAsync);
        var apiMessage = QueryResultMapper(result, message, StatusCodes.Status500InternalServerError);
        if (apiMessage.SystemError.GetValue(out var error)) logger.LogError(error, "Error occured from run sql: ");
        return TypedResults.Json(apiMessage.ApiMessage, statusCode: apiMessage.StatusCode);
    }
}