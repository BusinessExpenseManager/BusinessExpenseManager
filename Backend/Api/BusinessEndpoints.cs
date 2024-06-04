﻿using System.Data.Common;
using Backend.Helpers;
using Backend.Helpers.Cognito;
using Backend.Types;
using Backend.Types.Endpoint;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Api;

public static class BusinessEndpoints
{
    public static void ResisterEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/business");
        group.MapGet("/", GetBusiness);
        group.MapPost("/add", AddBusiness);
    }

    private static Task<JsonHttpResult<ApiMessage<int>>> AddBusiness(ILogger<Program> logger,
        DbDataSource source,
        BusinessAdd business,
        ICognitoService cognito)
    {
        return source.RunSqlQuery(logger, "Unable to add businesses", con =>
            con.QuerySingleAsync<int>(
                "INSERT INTO businesses(name, user_cognito_identifier) VALUES(@Name, @UserCognitoIdentifier) RETURNING id",
                new DynamicParameters(business).MergeObject(cognito.Get())
            ));
    }

    private static Task<JsonHttpResult<ApiMessage<Business>>> GetBusiness(
        ILogger<Program> logger,
        DbDataSource source,
        ICognitoService cognito) =>
        source.RunSqlQuery(logger, "Unable to get businesses", con =>
            con.QuerySingleAsync<Business>(
                "SELECT id, name, created_datetime FROM businesses WHERE user_cognito_identifier = @UserCognitoIdentifier ",
                cognito.Get()
            ));
}