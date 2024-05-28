using System.Diagnostics.CodeAnalysis;
using DotNext;

namespace Backend.Helpers;

public static class ResultExtensions
{
    public static bool IsOk<T>(this Result<T> result, [MaybeNullWhen(false)] out T data)
    {
        data = result.ValueOrDefault;
        return result.IsSuccessful;
    }
}