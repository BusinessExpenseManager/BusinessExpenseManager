using Backend.Model;

namespace Backend.Helpers;

public class CognitoMiddleware
{
    private readonly RequestDelegate _next;
    private readonly CognitoService _cognitoService;

    public CognitoMiddleware(RequestDelegate next, CognitoService cognitoService)
    {
        _next = next;
        _cognitoService = cognitoService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _cognitoService.CognitoUser = new CognitoUser("123");
        await _next(context);
    }
}