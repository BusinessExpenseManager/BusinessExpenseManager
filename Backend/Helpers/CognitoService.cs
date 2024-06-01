using Backend.Model;

namespace Backend.Helpers;

public class CognitoService : ICognitoService
{
    public CognitoService()
    {
    }

    public CognitoService(CognitoUser? cognitoUser)
    {
        CognitoUser = cognitoUser;
    }

    public CognitoUser? CognitoUser { get; set; }

    public CognitoUser? GetCognitoUser()
    {
        return CognitoUser;
    }
}