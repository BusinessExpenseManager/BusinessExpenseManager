using System.Data;
using Backend.Helpers;
using Backend.Model;
using Backend.Model.Domain;
using Backend.Types;
using Dapper;
using DotNext.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

using static QuerySqlHelper;

public static class MonetaryFlowEndpoints
{
    public static void Map(WebApplication app)
    {
        var group = app.MapGroup("/monetary_flow");
        group.MapGet("/", GetAllMonetaryFlow);
        group.MapPut("/add", AddMonetaryFlow);
        group.MapPatch("/delete", DeleteMonetaryFlow);
    }

    private static Task<JsonHttpResult<ApiMessage<int>>> AddMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        MonetaryFlowAdd flow) =>
        RunSqlQuery(logger, "Unable to add monetary flow", () =>
            connection.QuerySingleAsync<int>(
                "SELECT * FROM add_new_monetary_flow(@CognitoIdentifier, @GoalId, @CategoryId, @MonetaryValue)",
                flow.ConvertToDictAndAddProperty("CognitoIdentifier", "123")));

    private static Task<JsonHttpResult<ApiMessage<IEnumerable<MonetaryFlowItems>>>> GetAllMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        PagingData pagingData) =>
        RunSqlQuery(logger, "Unable to get all monetary flows",
            () =>
            {
                var dynamicParameters = new DynamicParameters();
                dynamicParameters.Add("cognito_identifier", "123");
                dynamicParameters.Add("page_offset", pagingData.PageOffset);
                // dynamicParameters.AddDynamicParams(new { CognitoIdentifier = "123" })

                var dataTable = new DataTable();

                var tvpExampleType = new List<MonetaryFlowItems>();
                // dynamicParameters.Add("full_monetary_flow", tvpExampleType.AsTableValuedParameter("dbo.TvpExampleType"),
                // direction: ParameterDirection.Output);

                var queryAsync1 = connection.ExecuteAsync(
                    "retrieve_monetary_flows",
                    dynamicParameters
                );

                var convert = queryAsync1.Convert(_ =>
                    dynamicParameters.Get<IEnumerable<MonetaryFlowItems>>("full_monetary_flow"));

                /*var queryAsync = connection.QueryAsync<MonetaryFlowItems>(
                    "SELECT * FROM retrieve_monetary_flows(@CognitoIdentifier, @PageOffset)",
                    dynamicParameters
                );*/


                return convert;
            });

    private static Task<JsonHttpResult<ApiMessage<int>>> DeleteMonetaryFlow(
        ILogger<Program> logger,
        IDbConnection connection,
        MonetaryFlowDelete flow)
    {
        return RunSqlQuery(logger, "Unable to delete monetary flow", DeleteMonetaryFlowProc);

        Task<int> DeleteMonetaryFlowProc()
        {
            var p = new DynamicParameters(new { cognito_identifier = "123" });
            p.AddDynamicParams(new { flow_id = flow.Id });
            p.Add("removed_monetary_flow_id", dbType: DbType.Int32, direction: ParameterDirection.Output);
            var executeAsync = connection.ExecuteAsync(
                "delete_monetary_flow",
                p);
            var removedId = executeAsync.Convert(_ => p.Get<int>("removed_monetary_flow_id"));
            return removedId;
        }
    }


    /*private static Task<int> DeleteMonetaryFlowProc(IDbConnection connection)
    {
        var p = new DynamicParameters();
        p.Add("cognito_identifier", "123");
        p.Add("flow_id", 1);
        return connection.ExecuteAsync(
            "delete_monetary_flow",
            p, commandType:
            CommandType.StoredProcedure);
    }*/
}