using Dapper;

namespace Backend.Helpers.Extention;

public static class DynamicParametersExtentions
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