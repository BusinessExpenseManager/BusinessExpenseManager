using System.Data;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Backend.Types.Validators;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public class MonetaryFlowEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/monetary_flow");
        group.MapGet("/", GetAllMonetaryFlow).AddEndpointFilter<ValidationFilter<PagingData>>();
        group.MapPost("/add", AddMonetaryFlow);
        group.MapDelete("/delete/{id:int}", DeleteMonetaryFlow);
    }

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<MonetaryFlowItems>>>> GetAllMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        ICognitoService cognito,
        PagingData pagingData) =>
        ResponseHelper.RunSqlQuery(logger, "Unable to get all monetary flows", async () =>
            await connection.QueryAsync<MonetaryFlowItems>(
                "SELECT * FROM retrieve_monetary_flows(@UserCognitoIdentifier, @PageOffset)",
                new DynamicParameters(pagingData).MergeObject(cognito.Get())
            ));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        ICognitoService cognito,
        MonetaryFlowAdd flow) =>
        ResponseHelper.RunSqlQuery(logger, "Unable to add monetary flow", async () => await
            connection.QuerySingleAsync<int>(
                "SELECT * FROM add_new_monetary_flow(@UserCognitoIdentifier, @GoalId, @CategoryId, CAST(@MonetaryValue AS MONEY))",
                new DynamicParameters(flow).MergeObject(cognito.Get())
            ));

    private static Task<JsonHttpResult<ApiMessage<int>>> DeleteMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        ICognitoService cognito,
        int id) =>
        ResponseHelper.RunSqlQuery(logger, "Unable to delete monetary flow", async () =>
            await connection.QuerySingleAsync<int>(
                "SELECT * FROM delete_monetary_flow(@UserCognitoIdentifier, @FlowId)",
                new DynamicParameters(new { FlowId = id }).MergeObject(cognito.Get())
            ));
}