namespace Backend.Helpers.Module;

public interface IModule
{
    void ResisterEndpoints(IEndpointRouteBuilder app);
}