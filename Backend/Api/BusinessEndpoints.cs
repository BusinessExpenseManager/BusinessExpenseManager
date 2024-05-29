using System.Data;
using Backend.Model.Domain;
using Backend.Types;
using Dapper;
using static Backend.Helpers.QuerySqlHelper;

namespace Backend.Api;

public static class BusinessEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/business");
        group.MapGet("/",
            (ILogger<Program> logger, IDbConnection connection) => GetBusinesses(logger, connection).Task);

        group.MapPut("/add",
            (ILogger<Program> logger, IDbConnection connection, BusinessAdd business) =>
                AddBusiness(logger, connection, "123", business.Name).Task);
    }

    private static ApiTask<IEnumerable<Business>> GetBusinesses(ILogger<Program> logger, IDbConnection connection)
    {
        return RunSqlQueryTask(logger, "Unable to get all businesses", Func);

        // TODO: cognito from middleware 
        Task<IEnumerable<Business>> Func() =>
            connection.QueryAsync<Business>("SELECT * FROM businesses where user_guid = '123' LIMIT 1;");
    }

    private static ApiTask<int> AddBusiness(ILogger<Program> logger, IDbConnection connection, string userGuid,
        string name)
    {
        return RunSqlQueryTask(logger, "Unable to add businesses", Func);

        Task<int> Func() =>
            connection.QuerySingleAsync<int>("INSERT INTO businesses(name, user_guid)  VALUES (@1, @2);",
                new { name, userGuid });
    }
}