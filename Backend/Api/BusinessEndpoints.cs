using System.Data;

namespace Backend.Api;

public static class BusinessEndpoints
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/", async (ILogger<Program> logger, IDbConnection connection) => { });
    }
}