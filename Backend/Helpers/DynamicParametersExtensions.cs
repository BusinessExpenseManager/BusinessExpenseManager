using Dapper;

namespace Backend.Helpers;

public static class DynamicParametersExtensions
{
    public static DynamicParameters MergeObject(this DynamicParameters parameters, object? param)
    {
        parameters.AddDynamicParams(param);
        return parameters;
    }

    public static DynamicParameters MergeProperty(this DynamicParameters parameters, string key, object value)
    {
        parameters.Add(key, value);
        return parameters;
    }
}