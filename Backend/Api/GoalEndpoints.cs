using System.Data;
using System.Data.Common;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Backend.Types.Validators;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public class GoalEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/goal");
        group.MapGet("/", GetAllGoals).AddEndpointFilter<ValidationFilter<PagingData>>();
        // group.MapGet("/{id:int}", GetGoal);
        group.MapPost("/add", AddGoal).AddEndpointFilter<ValidationFilter<GoalAdd>>();
    }

    /*private static Task<JsonHttpResult<ApiMessage<Goal>>> GetGoal(
        ILogger<Program> logger,
        IDbConnection connection,
        int id
    ) =>
        RunSqlQuery(logger, "Unable to get goal by id",
            () => connection.QuerySingleAsync<Goal>("SELECT * FROM goals WHERE id = @id;", new { id }));*/

    private static Task<JsonHttpResult<ApiMessage<int>>> AddGoal(
        ILogger<Program> logger,
        DbDataSource source,
        GoalAdd goal,
        ICognitoService cognito
    ) =>
        source.RunSqlQuery(logger, "Unable to add goal", con => con.QuerySingleAsync<int>(
            "INSERT INTO goals (name, description, goal_monetary_value, goal_due_datetime) values (@Name, @Description, @GoalMonetaryValue, @GoalDueDatetime) RETURNING id;",
            new DynamicParameters(goal).MergeObject(cognito.Get())
        ));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Goal>>>> GetAllGoals(
        ILogger<Program> logger,
        DbDataSource source,
        PagingData pageData,
        ICognitoService cognito
    ) =>
        source.RunSqlQuery(logger, "Unable to get all goals", con => con.QueryAsync<Goal>(
            "SELECT * FROM goals LIMIT 10 OFFSET @PageOffset;",
            new DynamicParameters(pageData).MergeObject(cognito.Get())
        ));
}