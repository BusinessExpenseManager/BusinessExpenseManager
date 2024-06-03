using System.Data;
using System.Data.Common;
using Backend.Api;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Backend.Types.Validators;
using Dapper;
using FluentValidation;
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

var dataSource = NpgsqlDataSource.Create(connectionString);
DefaultTypeMap.MatchNamesWithUnderscores = true;
var connection = dataSource.CreateConnection();
builder.Services.AddSingleton<IDbConnection>(_ => connection);
builder.Services.AddSingleton<DbDataSource>(_ => dataSource);

builder.Services.AddScoped<ICognitoService, CognitoService>();
builder.Services.AddScoped<IValidator<GoalAdd>, GoalValidator>();
builder.Services.AddScoped<IValidator<BusinessAdd>, BusinessValidator>();
builder.Services.AddScoped<IValidator<PagingData>, PagingDataValidator>();

builder.Services.AddLogging();
builder.Services.AddCors();

var app = builder.Build();

// Post this here to prevent cors errors.
app.MapGet("/", () => "Health GOOD");

app.UseMiddleware<CognitoMiddleware>();
app.UseCors(corsPolicyBuilder =>
    corsPolicyBuilder.WithOrigins(["https://web.karle.co.za"])
        .WithHeaders(["Content-Type", "Authorization"])
        .WithMethods([HttpMethods.Get, HttpMethods.Post]));

BusinessEndpoints.ResisterEndpoints(app);
CategoryBudgetEndpoints.ResisterEndpoints(app);
CategoryEndpoints.ResisterEndpoints(app);
GoalEndpoints.ResisterEndpoints(app);
MonetaryFlowEndpoints.ResisterEndpoints(app);

app.Run();