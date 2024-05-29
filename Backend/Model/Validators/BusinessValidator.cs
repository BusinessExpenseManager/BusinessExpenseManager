using Backend.Model.Domain;
using FluentValidation;

namespace Backend.Model.Validators;

public class BusinessValidator : AbstractValidator<BusinessAdd>
{
    public BusinessValidator()
    {
        RuleFor(p => p.Name).NotEmpty().MaximumLength(15);
    }
}