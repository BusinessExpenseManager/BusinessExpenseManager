using System.Data;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public class BusinessEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/business");
        group.MapGet("/", GetBusinesses);
        group.MapPost("/add", AddBusiness);
    }

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Business>>>> GetBusinesses(
        ILogger<Program> logger,
        IDbConnection connection,
        ICognitoService cognito
    ) =>
        ResponseHelper.RunSqlQuery(logger, "Unable to get business", async () => await connection.QueryAsync<Business>(
            "SELECT id, name, created_datetime  FROM businesses where user_cognito_identifier = @UserCognitoIdentifier LIMIT 1;",
            cognito.Get()));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddBusiness(
        ILogger<Program> logger,
        IDbConnection connection,
        BusinessAdd business,
        ICognitoService cognito) =>
        ResponseHelper.RunSqlQuery(logger, "Unable to add businesses", async () => await
            connection.QuerySingleAsync<int>(
                "INSERT INTO businesses(name, user_cognito_identifier)  VALUES (@Name, @UserCognitoIdentifier);",
                new DynamicParameters(business).MergeObject(cognito.Get())
            ));
}