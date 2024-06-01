using Backend.Types;

namespace Backend.Helpers.Cognito;

public class CognitoService : ICognitoService
{
    private CognitoUser CognitoUser { get; set; } = null!;

    public CognitoUser Get()
    {
        return CognitoUser;
    }

    public void Set(CognitoUser cognitoUser)
    {
        CognitoUser = cognitoUser;
    }
}