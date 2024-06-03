using System.Data;
using System.Data.Common;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class BusinessEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/business");
        group.MapGet("/", GetBusinesses);
        group.MapPost("/add", AddBusiness);
    }

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Business>>>> GetBusinesses(
        ILogger<Program> logger,
        DbDataSource source,
        ICognitoService cognito
    ) =>
        source.RunSqlQuery(logger, "Unable to get business", con => con.QueryAsync<Business>(
            "SELECT id, name, created_datetime  FROM businesses where user_cognito_identifier = @UserCognitoIdentifier LIMIT 1;",
            cognito.Get()));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddBusiness(
        ILogger<Program> logger,
        DbDataSource source,
        BusinessAdd business,
        ICognitoService cognito) =>
        source.RunSqlQuery(logger, "Unable to add businesses", async con => await
            con.QuerySingleAsync<int>(
                "INSERT INTO businesses(name, user_cognito_identifier)  VALUES (@Name, @UserCognitoIdentifier);",
                new DynamicParameters(business).MergeObject(cognito.Get())
            ));
}