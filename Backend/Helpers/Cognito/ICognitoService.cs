using Backend.Types;

namespace Backend.Helpers.Cognito;

public interface ICognitoService
{
    public CognitoUser Get();
    void Set(CognitoUser cognitoUser);
}