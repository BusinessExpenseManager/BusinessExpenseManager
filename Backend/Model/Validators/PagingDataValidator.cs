using Backend.Types;
using FluentValidation;

namespace Backend.Model.Validators;

public class PagingDataValidator : AbstractValidator<PagingData>
{
    public PagingDataValidator()
    {
        RuleFor(p => p.Page).GreaterThan(0);
    }
}