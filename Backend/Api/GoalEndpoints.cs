using System.Data;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Helpers.Extention;
using Backend.Helpers.Module;
using Backend.Model;
using Backend.Model.Domain;
using Backend.Model.Validators;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

using static ResponseHelper;

public class GoalEndpoints : IModule
{
    public void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/goal");
        group.MapGet("/", GetAllGoals).AddEndpointFilter<ValidationFilter<PagingData>>();
        // group.MapGet("/{id:int}", GetGoal);
        group.MapPut("/add", AddGoal).AddEndpointFilter<ValidationFilter<GoalAdd>>();
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
        IDbConnection connection,
        GoalAdd goal,
        ICognitoService cognito
    ) =>
        RunSqlQuery(logger, "Unable to add goal", () => connection.QuerySingleAsync<int>(
            "INSERT INTO goals (name, description, goal_monetary_value, goal_due_datetime) values (@Name, @Description, @GoalMonetaryValue, @GoalDueDatetime) RETURNING id;",
            new DynamicParameters(goal).MergeObject(cognito.Get())
        ));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Goal>>>> GetAllGoals(
        ILogger<Program> logger,
        IDbConnection connection,
        PagingData pageData,
        ICognitoService cognito
    ) =>
        RunSqlQuery(logger, "Unable to get all goals",
            () => connection.QueryAsync<Goal>("SELECT * FROM goals LIMIT 10 OFFSET @PageOffset;",
                new DynamicParameters(pageData).MergeObject(cognito.Get())
            ));
}