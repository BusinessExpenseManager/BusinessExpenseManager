using Backend.Types.Endpoint;
using FluentValidation;

namespace Backend.Types.Validators;

public class GoalValidator : AbstractValidator<GoalAdd>
{
    public GoalValidator()
    {
        RuleFor(p => p.Name).NotEmpty().MaximumLength(15);
        RuleFor(p => p.Description).NotEmpty().MaximumLength(150);
        RuleFor(p => p.GoalMonetaryValue).GreaterThan(0);
        // TODO: date validation for date time.
        // RuleFor(p => p.GoalDueDatetime).GreaterThan(0);
    }
}