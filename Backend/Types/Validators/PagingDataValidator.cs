using FluentValidation;

namespace Backend.Types.Validators;

public class PagingDataValidator : AbstractValidator<PagingData>
{
    public PagingDataValidator()
    {
        RuleFor(p => p.Page).GreaterThan(0);
    }
}