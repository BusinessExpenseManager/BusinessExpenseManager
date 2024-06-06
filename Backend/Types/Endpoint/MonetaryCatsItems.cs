namespace Backend.Types.Endpoint;

public record MonetaryCatsItems(
    int FlowId,
    string CategoryName,
    decimal MonetaryValue,
    DateTime CreatedDatetime);