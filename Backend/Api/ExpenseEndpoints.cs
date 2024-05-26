using System.Data;

namespace Backend.Api;

public static class ExpenseEndpoints
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/", async (ILogger<Program> logger, IDbConnection connection) => { });
    }
}