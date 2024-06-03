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
        group.MapPost("/", GetOrCreateBusiness);
    }

    private static Task<JsonHttpResult<ApiMessage<int>>> GetOrCreateBusiness(
        ILogger<Program> logger,
        DbDataSource source,
        BusinessAdd business,
        ICognitoService cognito) =>
        source.RunSqlQuery(logger, "Unable to get or add businesses", con =>
            con.QuerySingleAsync<int>(
                "SELECT * FROM get_or_create_business(@CategoryId, @Name)",
                new DynamicParameters(business).MergeObject(cognito.Get())
            ));
}