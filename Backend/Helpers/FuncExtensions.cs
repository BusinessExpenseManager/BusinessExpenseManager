using DotNext;

namespace Backend.Helpers;

public static class FuncExtensions
{
    /// <summary>
    ///     Invokes async function without throwing the exception.
    /// </summary>
    /// <typeparam name="TResult">The result type.</typeparam>
    /// <typeparam name="T1">The param passed in</typeparam>
    /// <param name="function">The function to invoke.</param>
    /// <param name="param">The param passed in</param>
    /// <returns>The invocation result.</returns>
    public static async Task<Result<TResult>> TryInvokeAsync<T1, TResult>(this Func<T1, Task<TResult>> function,
        T1 param)
    {
        Result<TResult> result;
        try
        {
            result = await function(param);
        }
        catch (Exception e)
        {
            result = new Result<TResult>(e);
        }

        return result;
    }


    /// <summary>
    ///     Invokes async value function without throwing the exception.
    /// </summary>
    /// <typeparam name="TResult">The result type.</typeparam>
    /// <param name="function">The function to invoke.</param>
    /// <returns>The invocation result.</returns>
    public static async Task<Result<TResult>> TryInvokeAsync<TResult>(this Func<ValueTask<TResult>> function)
    {
        Result<TResult> result;
        try
        {
            result = await function();
        }
        catch (Exception e)
        {
            result = new Result<TResult>(e);
        }

        return result;
    }
}