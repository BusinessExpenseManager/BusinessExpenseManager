using System.Data;
using Backend.Api;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Dapper;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = new NpgsqlConnectionStringBuilder
{
    Host = builder.Configuration["DB_URL"] ?? throw new Exception("No DB_URL found"),
    Password = builder.Configuration["DB_PASSWORD"] ?? throw new Exception("No DB_PASSWORD found"),
    Username = builder.Configuration["DB_USERNAME"] ?? throw new Exception("No DB_USERNAME found"),
    Port = builder.Configuration.GetValue<int?>("DB_PORT") ?? NpgsqlConnection.DefaultPort,
    Database = builder.Configuration["DB_DATABASE"] ?? "bem"
};

await using var dataSource = NpgsqlDataSource.Create(connectionString);
DefaultTypeMap.MatchNamesWithUnderscores = true;
var connection = await dataSource.OpenConnectionAsync();
builder.Services.AddSingleton<IDbConnection>(_ => connection);
builder.Services.AddScoped<ICognitoService, CognitoService>();

builder.Services.AddLogging();
// builder.Services.AddCors();
var app = builder.Build();


app.MapGet("/", () => "Health GOOD");
app.MapGet("/1",
    (ILogger<Program> logger,
        IDbConnection connection1) => ResponseHelper.RunSqlQuery(logger, "wow", () => connection1.QueryAsync<int>(
        "select count(*) from information_schema.tables where table_type = 'BASE TABLE';")));

BusinessEndpoints.ResisterEndpoints(app);

app.Run();