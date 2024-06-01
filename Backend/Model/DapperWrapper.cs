using Dapper;

namespace Backend.Model;

public static class DapperWrapper
{
    public static DynamicParameters MergeProperty(this DynamicParameters parameters, string key, object value)
    {
        parameters.Add(key, value);
        return parameters;
    }
}