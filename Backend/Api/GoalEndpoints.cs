using System.Data;
using Backend.Helpers;
using Backend.Model.Domain;
using Backend.Model.Validators;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class GoalEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/goal");
        group.MapGet("/", GetAllGoals);
        group.MapGet("/{id:int}", GetGoal);

        group.MapPut("/add", AddGoal)
            .AddEndpointFilter<ValidationFilter<GoalAdd>>();
    }

    // TODO: what do we need from one goal
    private static Task GetGoal(ILogger<Program> logger, IDbConnection connection, int id)
    {
        throw new NotImplementedException();
    }

    private static async Task<JsonHttpResult<ApiMessage<int>>> AddGoal(ILogger<Program> logger,
        IDbConnection connection, GoalAdd goal)
    {
        // Call proc to insert goal
        var func = () =>
            connection.QuerySingleAsync<int>(
                "INSERT INTO goals (name, description, goal_monetary_value, goal_due_datetime) values (@Name, @Description, @GoalMonetaryValue, @GoalDueDatetime) RETURNING id;",
                goal);

        var result = await func.TryInvokeAsync();

        var apiMessageWrapper =
            ResponseHelper.QueryResultMapper(result, "Unable to add goal", StatusCodes.Status500InternalServerError);

        if (apiMessageWrapper.SystemError.GetValue(out var error)) logger.LogError(error, "Add goal Failed: ");

        return TypedResults.Json(apiMessageWrapper.ApiMessage, statusCode: apiMessageWrapper.StatusCode);
    }

    // TODO: pagination
    private static async Task<JsonHttpResult<ApiMessage<IEnumerable<Goal>>>> GetAllGoals(ILogger<Program> logger,
        IDbConnection connection, PagingData pageData)
    {
        var func = () =>
            connection.QueryAsync<Goal>("SELECT * FROM GOAL LIMIT 20 OFFSET 20;");
        var result = await func.TryInvokeAsync();

        var apiMessageWrapper =
            ResponseHelper.QueryResultMapper(result, "Unable to get all goals",
                StatusCodes.Status500InternalServerError);

        if (apiMessageWrapper.SystemError.GetValue(out var error)) logger.LogError(error, "Get all goals Failed: ");

        return TypedResults.Json(apiMessageWrapper.ApiMessage, statusCode: apiMessageWrapper.StatusCode);
    }
}