using Backend.Types;

namespace Backend.Helpers.Cognito;

public class CognitoService : ICognitoService
{
    private CognitoUser _cognitoUser = null!;
    public CognitoUser Get() => _cognitoUser;
    public void Set(CognitoUser cognitoUser) => _cognitoUser = cognitoUser;
}