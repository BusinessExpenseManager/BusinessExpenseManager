using System.Data;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Helpers.Module;
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
builder.Services.AddScoped<ICognitoService, CognitoService>();


/*builder.Services.AddAuthorization();
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Audience = "App client id";
        options.Authority = "https://cognito-idp.eu-west-2.amazonaws.com/Cognito User Pool id";
    });*/

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

var app = builder.Build();


app.UseCors(corsPolicyBuilder =>
    corsPolicyBuilder.WithOrigins(["https://web.karle.co.za"])
        .WithHeaders(["Content-Type", "Authorization"])
        .WithMethods([HttpMethods.Get, HttpMethods.Post]));
app.MapGet("/", c => c.Response.WriteAsync("Health is good!!!"));
app.UseMiddleware<CognitoMiddleware>();

// app.UseAuthorization();
// app.UseAuthentication();


ModuleLoader.LoadModules(app);

app.Run();