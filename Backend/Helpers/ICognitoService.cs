using Backend.Model;

namespace Backend.Helpers;

public interface ICognitoService
{
    public CognitoUser? GetCognitoUser();
}