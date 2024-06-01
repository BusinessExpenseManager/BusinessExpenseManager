namespace Backend.Model;

public static class DapperWrapper
{
    // Trash Dapper will not accept more than 1 parameter in a query so have to kind of rip out all the parameters and stuff then into a dictionary.
    // This is most probably super inefficient the other alternative is to use add Cognito user to all of our request types but could see that being a security risk.
    public static Dictionary<string, object?> ConvertToDictAndAddProperty(this object originalObject,
        string newPropertyName,
        object newPropertyValue)
    {
        // Create an ExpandoObject and cast it to IDictionary to dynamically add properties
        var dictionary = new Dictionary<string, object?>();
        // Copy existing properties from the original object
        originalObject.GetType().GetProperties()
            .ToList()
            .ForEach(prop => dictionary[prop.Name] = prop.GetValue(originalObject));
        // Add the new property
        dictionary[newPropertyName] = newPropertyValue;
        return dictionary;
    }
}