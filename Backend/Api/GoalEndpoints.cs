using System.Data;
using Backend.Model.Domain;
using Backend.Model.Validators;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using static Backend.Helpers.QuerySqlHelper;

namespace Backend.Api;

public static class GoalEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/goal");
        group.MapGet("/", GetAllGoals).AddEndpointFilter<ValidationFilter<PagingData>>();
        group.MapGet("/{id:int}", GetGoal);
        group.MapPut("/add", AddGoal).AddEndpointFilter<ValidationFilter<GoalAdd>>();
    }

    private static Task<JsonHttpResult<ApiMessage<Goal>>> GetGoal(
        ILogger<Program> logger,
        IDbConnection connection,
        int id
    ) =>
        RunSqlQuery(logger, "Unable to get goal with id " + id + "",
            () => connection.QuerySingleAsync<Goal>("SELECT * FROM goals WHERE id = @id;", new { id }));

    private static Task<JsonHttpResult<ApiMessage<int>>> AddGoal(
        ILogger<Program> logger,
        IDbConnection connection,
        GoalAdd goal
    ) =>
        RunSqlQuery(logger, "Unable to add goal", () => connection.QuerySingleAsync<int>(
            "INSERT INTO goals (name, description, goal_monetary_value, goal_due_datetime) values (@Name, @Description, @GoalMonetaryValue, @GoalDueDatetime) RETURNING id;",
            goal));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Goal>>>> GetAllGoals(
        ILogger<Program> logger,
        IDbConnection connection,
        PagingData pageData
    ) =>
        RunSqlQuery(logger, "Unable to get all goals",
            () => connection.QueryAsync<Goal>("SELECT * FROM goals LIMIT 10 OFFSET @PageOffset;", pageData));
    
}