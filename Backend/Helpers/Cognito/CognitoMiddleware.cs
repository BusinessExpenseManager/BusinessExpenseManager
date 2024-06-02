using Backend.Types;

namespace Backend.Helpers.Cognito;

public class CognitoMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, ICognitoService cognitoService)
    {
        //TODO: Add Cognito requests and stuff here 

        /*var headersAuthorization = context.Request.Headers.Authorization;

        if (headersAuthorization.Count < 1)
        {
            await context.Response.WriteAsJsonAsync(TypedResults.Json(
                ApiMessage<int>.FailureResult("You Must be logged in to make this request"), statusCode: 401));
            return;
        }*/

        

        cognitoService.Set(new CognitoUser("123"));
        await next(context);
    }
}