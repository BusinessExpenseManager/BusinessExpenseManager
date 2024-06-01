using System.Data;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Helpers.Extention;
using Backend.Helpers.Module;
using Backend.Model;
using Backend.Model.Domain;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

using static ResponseHelper;

public class BusinessEndpoints : IModule
{
    public void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/business");
        group.MapGet("/", GetBusinesses);
        group.MapPut("/add", AddBusiness);
    }

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Business>>>> GetBusinesses(
        ILogger<Program> logger,
        IDbConnection connection,
        ICognitoService cognito
    ) =>
        RunSqlQuery(logger, "Unable to get business",
            () => connection.QueryAsync<Business>(
                "SELECT * FROM businesses where user_cognito_identifier = @CognitoIdentifier LIMIT 1;",
                cognito.Get()));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddBusiness(
        ILogger<Program> logger,
        IDbConnection connection,
        BusinessAdd business,
        ICognitoService cognito) =>
        RunSqlQuery(logger, "Unable to add businesses", () =>
            connection.QuerySingleAsync<int>(
                "INSERT INTO businesses(name, user_cognito_identifier)  VALUES (@Name, @CognitoIdentifier);",
                new DynamicParameters(business).MergeObject(cognito.Get())
            ));
}