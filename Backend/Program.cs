using System.Data.Common;
using System.Text.Json;
using Backend.Api;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Backend.Types.Validators;
using Dapper;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

var connectionString = new NpgsqlConnectionStringBuilder
{
    Host = builder.Configuration["DB_URL"] ?? throw new Exception("No DB_URL found"),
    Password = builder.Configuration["DB_PASSWORD"] ?? throw new Exception("No DB_PASSWORD found"),
    Username = builder.Configuration["DB_USERNAME"] ?? throw new Exception("No DB_USERNAME found"),
    Port = builder.Configuration.GetValue<int?>("DB_PORT") ?? NpgsqlConnection.DefaultPort,
    Database = builder.Configuration["DB_DATABASE"] ?? "bem",
    Pooling = true,
    MaxPoolSize = 20,
};
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            IssuerSigningKeyResolver = (_, _, _, parameters) =>
            {
                var json = new HttpClient().GetStringAsync(parameters.ValidIssuer + "/.well-known/jwks.json").Result;
                var keys = JsonSerializer.Deserialize<JsonWebKeySet>(json)?.Keys;
                return keys!;
            },

            ValidIssuer = "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_28ckopm51",
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidAudience = "7g2q9pb8e9ro0bb1hpp8vc0i4n",
            ValidateAudience = false
        };
    });


var dataSource = NpgsqlDataSource.Create(connectionString);
DefaultTypeMap.MatchNamesWithUnderscores = true;
builder.Services.AddSingleton<DbDataSource>(_ => dataSource);

builder.Services.AddScoped<ICognitoService, CognitoService>();
builder.Services.AddScoped<IValidator<GoalAdd>, GoalValidator>();
builder.Services.AddScoped<IValidator<BusinessAdd>, BusinessValidator>();
builder.Services.AddScoped<IValidator<PagingData>, PagingDataValidator>();

builder.Services.AddLogging();
builder.Services.AddCors();
var app = builder.Build();
// Post this here to prevent cors errors.
app.UseMiddleware<CognitoMiddleware>();
app.MapGet("/", () => "Health GOOD").AllowAnonymous();

var group = app.MapGroup("/").RequireAuthorization();

// Wanted to create these with reflection but that could have broke on AWS due to how it is built so these stay for now.
BusinessEndpoints.ResisterEndpoints(group);
CategoryBudgetEndpoints.ResisterEndpoints(group);
CategoryEndpoints.ResisterEndpoints(group);
GoalEndpoints.ResisterEndpoints(group);
MonetaryFlowEndpoints.ResisterEndpoints(group);

app.UseCors(corsPolicyBuilder =>
    corsPolicyBuilder.WithOrigins(["http://localhost:4200", "https://web.karle.co.za"])
        .WithHeaders(["Content-Type", "Authorization"])
        .WithMethods([HttpMethods.Get, HttpMethods.Post, HttpMethods.Delete, HttpMethods.Options]));


app.Run();