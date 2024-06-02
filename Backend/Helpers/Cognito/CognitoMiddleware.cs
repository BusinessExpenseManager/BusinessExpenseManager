using Backend.Types;

namespace Backend.Helpers.Cognito;

public class CognitoMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, ICognitoService cognitoService)
    {
        cognitoService.Set(new CognitoUser("123"));
        await next(context);
    }
}