using Backend.Helpers.Extention;
using Backend.Types;
using DotNext;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Helpers;

public abstract class ResponseHelper
{
    public static ApiMessageWrapper<T> QueryResultMapper<T>(Result<T> result, string errorMessage, int errorCode)
    {
        return result.Convert(ApiMessageWrapper<T>.SuccessResult)
            .OrInvoke(e => ApiMessageWrapper<T>.FailureResult(errorMessage, errorCode, e));
    }

    public static async Task<JsonHttpResult<ApiMessage<T>>> RunSqlQuery<T>(ILogger logger, string message,
        Func<Task<T>> func)
    {
        var result = await func.TryInvokeAsync();
        var apiMessage = ResponseHelper.QueryResultMapper(result, message, StatusCodes.Status500InternalServerError);
        if (apiMessage.SystemError.GetValue(out var error)) logger.LogError(error, "Error occured from run sql: ");
        return TypedResults.Json(apiMessage.ApiMessage, statusCode: apiMessage.StatusCode);
    }
}