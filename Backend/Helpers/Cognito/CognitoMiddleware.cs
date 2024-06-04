using System.Security.Claims;
using Backend.Types;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Helpers.Cognito;

public class CognitoMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, ICognitoService cognitoService)
    {
        if (context.GetEndpoint()?.Metadata.GetMetadata<IAllowAnonymous>() != null)
        {
            await next(context);
            return;
        }

        var email = context.User.FindFirst(ClaimTypes.Email)?.Value;
        if (context.User.Identity is { IsAuthenticated: true } && email != null)
            cognitoService.Set(new CognitoUser(email));
        else
        {
            // Return unauthorized error
            context.Response.StatusCode = 401; // Unauthorized
            await context.Response.WriteAsync("Unauthorized: Email not found");
            return;
        }
    }
}