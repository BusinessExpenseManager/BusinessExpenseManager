using System.Data;

namespace Backend.Api;

public static class MonetaryFlowEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/monetary_flow");
        group.MapGet("/", GetAllMonetaryFlow);
        group.MapGet("/add", AddMonetaryFlow);
    }

    private static Task AddMonetaryFlow(ILogger<Program> logger, IDbConnection connection)
    {
        throw new NotImplementedException();
    }

    private static Task GetAllMonetaryFlow(ILogger<Program> logger, IDbConnection connection)
    {
        throw new NotImplementedException();
    }
}