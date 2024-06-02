using System.Text.Json.Serialization;
using Backend.Helpers;

namespace Backend.Types.Endpoint;

public record GoalAdd(
    string Name,
    string Description,
    decimal GoalMonetaryValue,
    [property: JsonConverter(typeof(DateTimeJsonConverter))]
    DateTime GoalDueDatetime);