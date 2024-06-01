using System.Diagnostics.CodeAnalysis;
using DotNext;

namespace Backend.Helpers.Extention;

public static class OptionalExtensions
{
    /// <summary>
    ///     Returns <paramref name="self" /> if it contains a value, otherwise calls <paramref name="elseFn" /> and returns the
    ///     result.
    /// </summary>
    /// <typeparam name="T">The type contained by the option.</typeparam>
    /// <param name="self">The option.</param>
    /// <param name="elseFn">The function that creates the alternate value if the option is <c>None</c>.</param>
    /// <exception cref="System.ArgumentNullException">Thrown if <paramref name="elseFn" /> is null.</exception>
    public static Optional<T> OrElse<T>(this Optional<T> self, Func<Optional<T>> elseFn) where T : notnull
    {
        return self.HasValue ? elseFn() : self;
    }

    /// <summary>
    ///     Returns <c>None</c> if the option is <c>None</c>, otherwise calls <paramref name="thenFn" /> with the wrapped value
    ///     and returns the result.
    /// </summary>
    /// <typeparam name="T1">The type contained by the first option.</typeparam>
    /// <typeparam name="T2">The type contained by the second option.</typeparam>
    /// <param name="self">The first option.</param>
    /// <param name="thenFn">The function to call with the contained value, if there is a contained value.</param>
    /// <exception cref="System.ArgumentNullException">Thrown if <paramref name="thenFn" /> is null.</exception>
    public static Optional<T2> AndThen<T1, T2>(this Optional<T1> self, Func<T1, Optional<T2>> thenFn)
        where T1 : notnull
        where T2 : notnull
    {
        return self.HasValue ? thenFn(self.Value) : default;
    }

    public static bool GetValue<T>(this Optional<T> result, [MaybeNullWhen(false)] out T data)
    {
        data = result.ValueOrDefault;
        return result.HasValue;
    }
}