using System.Runtime.CompilerServices;
using DotNext;

namespace Backend.Helpers;

public static class FuncExtensions
{
    /// <summary>
    ///     Invokes async function without throwing the exception.
    /// </summary>
    /// <typeparam name="TResult">The result type.</typeparam>
    /// <param name="function">The function to invoke.</param>
    /// <returns>The invocation result.</returns>
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static async Task<Result<TResult>> TryInvokeAsync<TResult>(this Func<Task<TResult>> function)
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


    /// <summary>
    ///     Invokes async value function without throwing the exception.
    /// </summary>
    /// <typeparam name="TResult">The result type.</typeparam>
    /// <param name="function">The function to invoke.</param>
    /// <returns>The invocation result.</returns>
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
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