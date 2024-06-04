using System.Security.Claims;
using Backend.Types;

namespace Backend.Helpers.Cognito;

public class CognitoMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, ICognitoService cognitoService)
    {
        
        if (context.User.Identity is { IsAuthenticated: true } &&
            context.User.FindFirst(ClaimTypes.Email)?.Value != null)
            cognitoService.Set(new CognitoUser(context.User.FindFirst(ClaimTypes.Email)!.Value));
        await next(context);
    }
}