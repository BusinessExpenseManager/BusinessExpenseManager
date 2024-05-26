using System.Data;

namespace Backend.Api;

public static class BudgetEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/budget");
        group.MapGet("/", async (ILogger<Program> logger, IDbConnection connection) => { });
    }
}