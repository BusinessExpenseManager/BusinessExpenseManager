using System.Data;
using Backend.Helpers;
using Backend.Model.Domain;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

using static QuerySqlHelper;

public static class MonetaryFlowEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/monetary_flow");
        group.MapGet("/", GetAllMonetaryFlow);
        group.MapPut("/add", AddMonetaryFlow);
    }

    private static Task<JsonHttpResult<ApiMessage<int>>> AddMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        MonetaryFlowAdd flow) =>
        RunSqlQuery(logger, "Unable to add monetary flow", () =>
            connection.QuerySingleAsync<int>(
                "INSERT INTO goals (name, description, goal_monetary_value, goal_due_datetime) values (@Name, @Description, @GoalMonetaryValue, @GoalDueDatetime) RETURNING id;",
                flow));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<MonetaryFlow>>>> GetAllMonetaryFlow(
        HttpContext context,
        ILogger<Program> logger,
        IDbConnection connection, PagingData pagingData) =>
        RunSqlQuery(logger, "Unable to get all monetary flows", () =>
            connection.QueryAsync<MonetaryFlow>("SELECT * FROM monetaryflows Limit 10 OFFSET @PageOffset", pagingData));
}