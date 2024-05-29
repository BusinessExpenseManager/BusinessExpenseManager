namespace Backend.Model.Domain;

public record Business(int Id, string Name, DateTime CreatedDatetime);

public record BusinessAdd(string Name);