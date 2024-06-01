using System.Data;
using Backend.Model.Domain;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using static Backend.Helpers.QuerySqlHelper;

namespace Backend.Api;

public static class BusinessEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/business");
        group.MapGet("/", GetBusinesses);
        group.MapPut("/add", AddBusiness);
    }

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Business>>>> GetBusinesses(
        ILogger<Program> logger,
        IDbConnection connection) =>
        RunSqlQuery(logger, "Unable to get business",
            () => connection.QueryAsync<Business>(
                "SELECT * FROM businesses where user_cognito_identifier = @CognitoIdentifier LIMIT 1;", ""));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddBusiness(
        ILogger<Program> logger,
        IDbConnection connection,
        BusinessAdd business
        /*CognitoUser user*/) =>
        RunSqlQuery(logger, "Unable to add businesses", () =>
            connection.QuerySingleAsync<int>(
                "INSERT INTO businesses(name, user_cognito_identifier)  VALUES (@Name, @CognitoIdentifier);",
                (business, "")));
}