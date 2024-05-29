using DotNext.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Backend.Types;

public record ApiTask<T>(Task<JsonHttpResult<ApiMessage<T>>> Task);