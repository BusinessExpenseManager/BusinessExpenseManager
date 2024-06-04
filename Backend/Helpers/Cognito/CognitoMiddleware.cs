using System.Security.Claims;
using Backend.Types;

namespace Backend.Helpers.Cognito;

public class CognitoMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, ICognitoService cognitoService)
    {
        if (context.User.Identity is { IsAuthenticated: true } &&
            context.User.FindFirst(ClaimTypes.Email) is { Value: not null } claim)
            cognitoService.Set(new CognitoUser(claim.Value));
        await next(context);
    }
}