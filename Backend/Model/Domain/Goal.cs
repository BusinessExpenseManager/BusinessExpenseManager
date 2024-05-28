using System.Text.Json.Serialization;
using Backend.Helpers;

namespace Backend.Model.Domain;

public record Goal(
    int Id,
    string Name,
    string Description,
    double GoalMonetaryValue,
    DateTime GoalDueDatetime
);

public record GoalAdd(
    string Name,
    string Description,
    decimal GoalMonetaryValue,
    [property: JsonConverter(typeof(DateTimeJsonConverter))]
    DateTime GoalDueDatetime);