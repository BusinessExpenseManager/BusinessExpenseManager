using System.Data;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Helpers.Extention;
using Backend.Helpers.Module;
using Backend.Model.Domain;
using Backend.Model.Validators;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

using static ResponseHelper;

public class MonetaryFlowEndpoints : IModule
{
    public void ResisterEndpoints(IEndpointRouteBuilder app)
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
        RunSqlQuery(logger, "Unable to get all monetary flows",
            () => connection.QueryAsync<MonetaryFlowItems>(
                "SELECT * FROM retrieve_monetary_flows(@CognitoIdentifier, @PageOffset)",
                new DynamicParameters(pagingData).MergeObject(cognito.Get())
            ));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        ICognitoService cognito,
        MonetaryFlowAdd flow) =>
        RunSqlQuery(logger, "Unable to add monetary flow", () =>
            connection.QuerySingleAsync<int>(
                "SELECT * FROM add_new_monetary_flow(@CognitoIdentifier, @GoalId, @CategoryId, CAST(@MonetaryValue AS MONEY))",
                new DynamicParameters(flow).MergeObject(cognito.Get())
            ));

    private static Task<JsonHttpResult<ApiMessage<int>>> DeleteMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        ICognitoService cognito,
        int id) =>
        RunSqlQuery(logger, "Unable to delete monetary flow",
            () => connection.QuerySingleAsync<int>(
                "SELECT * FROM delete_monetary_flow(@CognitoIdentifier, @FlowId)",
                new DynamicParameters(new { FlowId = id }).MergeObject(cognito.Get())
            ));
}