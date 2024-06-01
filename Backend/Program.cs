using System.Data;
using Backend.Helpers;
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
// builder.Services.AddScoped<CognitoService>();


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

// app.UseMiddleware<CognitoMiddleware>();

/*app.UseCors(corsPolicyBuilder =>
    corsPolicyBuilder.WithOrigins(["http://localhost:123"])
        .WithHeaders(["Content-Type", "Authorization"])
        .WithMethods([HttpMethods.Get, HttpMethods.Put]));

app.UseAuthorization();
app.UseAuthentication();

app.Use((context, func) =>
{
    return func(context);
});*/


ModuleLoader.LoadModules(app);

app.Run();