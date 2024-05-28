using System.Reflection;

namespace Backend.Types;

public class PagingData
{
    public string? SortBy { get; init; }
    public SortDirection SortDirection { get; init; }
    public int Offset { get; init; } = 1;

    public static ValueTask<PagingData?> BindAsync(HttpContext context, ParameterInfo parameter)
    {
        const string sortByKey = "sort_by";
        const string sortDirectionKey = "sort_dir";
        const string offsetKey = "offset";

        Enum.TryParse<SortDirection>(context.Request.Query[sortDirectionKey],
            true, out var sortDirection);
        if (!int.TryParse(context.Request.Query[offsetKey], out var offset)) offset = 0;
        var result = new PagingData
        {
            SortBy = context.Request.Query[sortByKey],
            SortDirection = sortDirection,
            Offset = offset
        };

        return ValueTask.FromResult<PagingData?>(result);
    }
}