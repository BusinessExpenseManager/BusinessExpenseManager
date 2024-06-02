using Backend.Types;

namespace Backend.Helpers.Cognito;

public interface ICognitoService
{
    CognitoUser Get();
    void Set(CognitoUser cognitoUser);
}