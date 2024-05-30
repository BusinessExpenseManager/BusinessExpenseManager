using System.Data;
using Backend.Api;
using Backend.Model.Domain;
using Backend.Model.Validators;
using Backend.Types;
using Dapper;
using FluentValidation;
using Npgsql;

var builder = WebApplication.CreateSlimBuilder(args);
builder.Services.AddLogging();
builder.Services.AddCors();
builder.Services.AddScoped<IValidator<GoalAdd>, GoalValidator>();
builder.Services.AddScoped<IValidator<BusinessAdd>, BusinessValidator>();
builder.Services.AddScoped<IValidator<PagingData>, PagingDataValidator>();


var connectionString = builder.Configuration["Database:ConnectionString"] ??
                       throw new Exception("No connection string found");

await using var dataSource = NpgsqlDataSource.Create(connectionString);
DefaultTypeMap.MatchNamesWithUnderscores = true;
var connection = await dataSource.OpenConnectionAsync();
builder.Services.AddSingleton<IDbConnection>(_ => connection);

var app = builder.Build();


// TODO: no to all methods and all headers.. 
app.UseCors(corsPolicyBuilder =>
    corsPolicyBuilder.WithOrigins(["http://localhost:123"]).AllowAnyHeader().AllowAnyMethod());
// TODO: add HttpsRedirection for real app  
// app.UseHttpsRedirection();
// TODO: add authorization

GoalEndpoints.Map(app);
BusinessEndpoints.Map(app);
CategoryEndpoints.Map(app);
MonetaryFlowEndpoints.Map(app);
CategoryBudgetEndpoints.Map(app);

app.Run();