using Backend.Types.Endpoint;
using FluentValidation;

namespace Backend.Types.Validators;

public class BusinessValidator : AbstractValidator<BusinessAdd>
{
    public BusinessValidator()
    {
        RuleFor(p => p.Name).NotEmpty().MaximumLength(15);
    }
}