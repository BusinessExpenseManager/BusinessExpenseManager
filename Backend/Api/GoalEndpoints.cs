using System.Data;
using Backend.Types;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Api;

public static class GoalEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/goal");
        group.MapGet("/", GetAllGoals);
        group.MapGet("/{id:int}", GetGoal);
        group.MapPut("/add", AddGoal);
        /*group.MapPut("/update", UpdateGoal);
        group.MapDelete("/delete/:id", DeleteGoal);*/
    }

    private static Task GetGoal(ILogger<Program> logger, IDbConnection connection, int id)
    {
        throw new NotImplementedException();
    }

    private static Task AddGoal(ILogger<Program> logger, IDbConnection connection)
    {
        throw new NotImplementedException();
    }

    private static Task GetAllGoals(ILogger<Program> logger, IDbConnection connection, PagingData pageData)
    {
        throw new NotImplementedException();
    }

    private static async Task<JsonHttpResult<ApiMessage<int>>> AddBusiness(ILogger<Program> logger,
        IDbConnection connection)
    {
        // if (!ModelState.IsValid)
        throw new NotImplementedException();

    }

    // TODO: cognito from middleware 
    private static async Task<JsonHttpResult<ApiMessage<IEnumerable<Category>>>> GetBusiness(
        ILogger<Program> logger, IDbConnection connection)
    {
        throw new NotImplementedException();
    }
}