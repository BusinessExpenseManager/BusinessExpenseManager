using FluentValidation;

namespace Backend.Types.Validators;

public class ValidationFilter<T> : IEndpointFilter

{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var validator = context.HttpContext.RequestServices.GetService<IValidator<T>>();
        // No validator we can move on.
        if (validator is null) return await next(context);

        // Get the entity from the args:
        var entity = context.Arguments
            .OfType<T>()
            .FirstOrDefault(a => a?.GetType() == typeof(T));

        // No entity we can move on.
        if (entity is null)
            return Results.Json(ApiMessage<T>.FailureResult("Could not find type to validate"),
                statusCode: StatusCodes.Status500InternalServerError);

        var validation = await validator.ValidateAsync(entity);
        if (validation.IsValid) return await next(context);

        return Results.Json(
            ApiMessage<IDictionary<string, string[]>>.FailureResultWithData("Validation error",
                validation.ToDictionary()),
            statusCode: StatusCodes.Status400BadRequest);
    }
}