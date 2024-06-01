using System.Data;
using Backend.Helpers;
using Backend.Helpers.Module;
using Backend.Model;
using Backend.Model.Domain;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

using static QuerySqlHelper;

public class MonetaryFlowEndpoints : IModule
{
    public void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/monetary_flow");
        group.MapGet("/", GetAllMonetaryFlow);
        group.MapPut("/add", AddMonetaryFlow);
        group.MapPatch("/delete", DeleteMonetaryFlow);
    }

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<MonetaryFlowItems>>>> GetAllMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        PagingData pagingData) =>
        RunSqlQuery(logger, "Unable to get all monetary flows",
            () => connection.QueryAsync<MonetaryFlowItems>(
                "SELECT * FROM retrieve_monetary_flows(@CognitoIdentifier, @PageOffset)",
                new DynamicParameters(pagingData).MergeProperty("CognitoIdentifier", "123")
            ));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        MonetaryFlowAdd flow) =>
        RunSqlQuery(logger, "Unable to add monetary flow", () =>
            connection.QuerySingleAsync<int>(
                "SELECT * FROM add_new_monetary_flow(@CognitoIdentifier, @GoalId, @CategoryId, CAST(@MonetaryValue AS MONEY))",
                new DynamicParameters(flow).MergeProperty("CognitoIdentifier", "123")
            ));

    private static Task<JsonHttpResult<ApiMessage<int>>> DeleteMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        MonetaryFlowDelete flow)
    {
        Console.WriteLine(flow);
        return RunSqlQuery(logger, "Unable to delete monetary flow",
            () => connection.QuerySingleAsync<int>(
                "SELECT * FROM delete_monetary_flow(@CognitoIdentifier, @FlowId)",
                new DynamicParameters(flow).MergeProperty("CognitoIdentifier", "123")
            ));
    }
}