using System.Data;
using Backend.Model.Domain;
using Backend.Types;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class BusinessEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/business");
        group.MapGet("/", GetBusiness);
        group.MapPut("/add", AddBusiness);
    }

    private static async Task<JsonHttpResult<ApiMessage<int>>> AddBusiness(ILogger<Program> logger,
        IDbConnection connection)
    {
        throw new NotImplementedException();
    }

    // TODO: cognito from middleware 
    private static async Task<JsonHttpResult<ApiMessage<IEnumerable<Category>>>> GetBusiness(
        ILogger<Program> logger, IDbConnection connection)
    {
        throw new NotImplementedException();
    }
}