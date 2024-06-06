using System.Data.Common;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Backend.Types.Validators;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class GoalEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/goal");
        group.MapGet("/", GetMonetaryFlowsForGoal).AddEndpointFilter<ValidationFilter<PagingData>>();
        group.MapGet("/names", GetAllGoals).AddEndpointFilter<ValidationFilter<PagingData>>();
        group.MapPost("/add", AddGoal).AddEndpointFilter<ValidationFilter<GoalAdd>>();
        // group.MapPost("/delete", DeleteGoal);
    }

    private static Task<JsonHttpResult<ApiMessage<int>>> DeleteGoal(ILogger<Program> logger,
        DbDataSource source,
        ICognitoService cognito,
        int id
    ) =>
        source.RunSqlQuery(logger, "Unable to delete goal", con => con.QuerySingleAsync<int>(
            "SELECT * FROM delete_goal(@UserCognitoIdentifier ,@Goal_ID)",
            new DynamicParameters(new { Goal_ID = id }).MergeObject(cognito.Get())
        ));


    private static Task<JsonHttpResult<ApiMessage<int>>> AddGoal(
        ILogger<Program> logger,
        DbDataSource source,
        GoalAdd goal,
        ICognitoService cognito
    ) =>
        source.RunSqlQuery(logger, "Unable to add goal", con => con.QuerySingleAsync<int>(
            "SELECT * FROM add_goal(@UserCognitoIdentifier, @Name, @Description, CAST(@GoalMonetaryValue AS MONEY), @GoalDueDatetime);",
            new DynamicParameters(goal).MergeObject(cognito.Get())
        ));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<MonetaryFlowGoalItems>>>> GetMonetaryFlowsForGoal(
        ILogger<Program> logger,
        DbDataSource source,
        ICognitoService cognito,
        PagingData page) =>
        source.RunSqlQuery(logger, "Unable to monetary goal flow", con =>
            con.QueryAsync<MonetaryFlowGoalItems>(
                "SELECT * FROM get_monetary_goals(@UserCognitoIdentifier, @PageOffset)",
                new DynamicParameters(page).MergeObject(cognito.Get())
            ));


    private static Task<JsonHttpResult<ApiMessage<IEnumerable<Goal>>>> GetAllGoals(
        ILogger<Program> logger,
        DbDataSource source,
        PagingData pageData,
        ICognitoService cognito
    ) =>
        source.RunSqlQuery(logger, "Unable to get all goals", con => con.QueryAsync<Goal>(
            "SELECT goals.id, goals.name FROM goals INNER JOIN businesses b on goals.business_id = b.id WHERE b.user_cognito_identifier = @UserCognitoIdentifier LIMIT 10 OFFSET @PageOffset;",
            new DynamicParameters(pageData).MergeObject(cognito.Get())
        ));
}