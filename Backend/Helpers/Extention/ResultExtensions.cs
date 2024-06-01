using System.Diagnostics.CodeAnalysis;
using DotNext;

namespace Backend.Helpers.Extention;

public static class ResultExtensions
{
    public static bool IsOk<T>(this Result<T> result, [MaybeNullWhen(false)] out T data)
    {
        data = result.ValueOrDefault;
        return result.IsSuccessful;
    }
}