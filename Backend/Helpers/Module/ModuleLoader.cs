using System.Reflection;
using Backend.Api;
using DotNext.Collections.Generic;

namespace Backend.Helpers.Module;

public static class ModuleLoader
{
    public static void LoadModules(WebApplication app)
    {
        Assembly.GetExecutingAssembly().GetTypes()
            .Where(t => typeof(IModule).IsAssignableFrom(t) && t.IsClass)
            .Select(type => (IModule)Activator.CreateInstance(type))
            .ForEach<IModule>(dataClass => dataClass.ResisterEndpoints(app));
    }
}