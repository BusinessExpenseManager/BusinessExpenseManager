using System.Data;
using Backend.Model.Domain;
using Backend.Model.Validators;
using Backend.Types;
using Dapper;
using DotNext;
using DotNext.Reflection;
using Microsoft.AspNetCore.Mvc;
using static Backend.Helpers.QuerySqlHelper;

namespace Backend.Api;

public static class GoalEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/goal");
        group.MapGet("/",
            (ILogger<Program> logger, IDbConnection connection, PagingData page) =>
                GetAllGoals(logger, connection, page).Task).AddEndpointFilter<ValidationFilter<PagingData>>();

        group.MapGet("/{id:int}",
            (ILogger<Program> logger, IDbConnection connection, int id) => GetGoal(logger, connection, id).Task);

        group.MapPut("/add",
            (ILogger<Program> logger, IDbConnection connection, [FromBody] GoalAdd goal) =>
                AddGoal(logger, connection, goal).Task).AddEndpointFilter<ValidationFilter<GoalAdd>>();
    }

    private static ApiTask<Goal> GetGoal(
        ILogger<Program> logger,
        IDbConnection connection,
        int id
    ) =>
        RunSqlQueryTask(logger, "Unable to get goal with id " + id + "",
            () => connection.QuerySingleAsync<Goal>("SELECT * FROM goals WHERE id = @id;", new { id }));

    private static ApiTask<int> AddGoal(
        ILogger<Program> logger,
        IDbConnection connection,
        [FromBody] GoalAdd goal
    ) =>
        RunSqlQueryTask(logger, "Unable to add goal", () => connection.QuerySingleAsync<int>(
            "INSERT INTO goals (name, description, goal_monetary_value, goal_due_datetime) values (@Name, @Description, @GoalMonetaryValue, @GoalDueDatetime) RETURNING id;",
            goal));

    private static ApiTask<IEnumerable<Goal>> GetAllGoals(
        ILogger<Program> logger,
        IDbConnection connection,
        PagingData pageData
    ) =>
        RunSqlQueryTask(logger, "Unable to get all goals",
            () => connection.QueryAsync<Goal>("SELECT * FROM goals LIMIT 10 OFFSET @PageOffset;", pageData));
}