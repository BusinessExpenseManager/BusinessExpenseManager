using System.Data.Common;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Backend.Types.Validators;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class MonetaryFlowEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/monetary_flow");
        group.MapGet("/", GetAllMonetaryFlow).AddEndpointFilter<ValidationFilter<PagingData>>();
        group.MapPost("/add", AddMonetaryFlow);
        group.MapDelete("/delete/{id:int}", DeleteMonetaryFlow);
        group.MapGet("/category", GetMonetaryFlowsForCategories);
    }


    private static Task<JsonHttpResult<ApiMessage<IEnumerable<MonetaryFlowItems>>>> GetAllMonetaryFlow(
        ILogger<Program> logger,
        DbDataSource source,
        ICognitoService cognito,
        PagingData pagingData) =>
        source.RunSqlQuery(logger, "Unable to get all monetary flows", con =>
            con.QueryAsync<MonetaryFlowItems>(
                "SELECT * FROM retrieve_monetary_flows(@UserCognitoIdentifier, @PageOffset)",
                new DynamicParameters(pagingData).MergeObject(cognito.Get())
            ));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddMonetaryFlow(
        ILogger<Program> logger,
        DbDataSource source,
        ICognitoService cognito,
        MonetaryFlowAdd flow) =>
        source.RunSqlQuery(logger, "Unable to add monetary flow", con =>
            con.QuerySingleAsync<int>(
                "SELECT * FROM add_new_monetary_flow(@UserCognitoIdentifier, @GoalId, @CategoryId, CAST(@MonetaryValue AS MONEY))",
                new DynamicParameters(flow).MergeObject(cognito.Get())
            ));

    private static Task<JsonHttpResult<ApiMessage<int>>> DeleteMonetaryFlow(
        ILogger<Program> logger,
        DbDataSource source,
        ICognitoService cognito,
        int id) =>
        source.RunSqlQuery(logger, "Unable to delete monetary flow", con =>
            con.QuerySingleAsync<int>(
                "SELECT * FROM delete_monetary_flow(@UserCognitoIdentifier, @FlowId)",
                new DynamicParameters(new { FlowId = id }).MergeObject(cognito.Get())
            ));


    private static Task<JsonHttpResult<ApiMessage<IEnumerable<MonetaryFlowCatItems>>>> GetMonetaryFlowsForCategories(
        ILogger<Program> logger,
        DbDataSource source,
        ICognitoService cognito,
        PagingData page) =>
        source.RunSqlQuery(logger, "Unable to monetary category flow", con =>
            con.QueryAsync<MonetaryFlowCatItems>(
                "SELECT * FROM get_monetary_categories(@UserCognitoIdentifier, @PageOffset)",
                new DynamicParameters(page).MergeObject(cognito.Get())
            ));
}