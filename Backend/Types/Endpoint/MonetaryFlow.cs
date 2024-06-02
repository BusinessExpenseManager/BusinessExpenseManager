using System.Diagnostics.CodeAnalysis;

namespace Backend.Model.Domain;

public record MonetaryFlow(
    int Id,
    int BusinessId,
    int GoalId,
    int CategoryId,
    decimal MonetaryValue,
    DateTime CreatedDatetime);

public record MonetaryFlowAdd(
    int GoalId,
    int CategoryId,
    decimal MonetaryValue);

public record MonetaryFlowDelete(
    int FlowId
);

public record MonetaryFlowItems(
    int FlowId,
    string GoalName,
    string CategoryName,
    decimal MonetaryValue,
    DateTime CreatedDatetime);