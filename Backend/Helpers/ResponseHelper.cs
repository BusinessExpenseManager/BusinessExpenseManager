using Backend.Types;
using DotNext;

namespace Backend.Helpers;

public abstract class ResponseHelper
{
    public static ApiMessageWrapper<T> QueryResultMapper<T>(Result<T> result, string errorMessage, int errorCode)
    {
        return result.Convert(ApiMessageWrapper<T>.SuccessResult)
            .OrInvoke(e => ApiMessageWrapper<T>.FailureResult(errorMessage, errorCode, e));
    }
}