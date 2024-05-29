using Backend.Model.Domain;
using Backend.Types;
using FluentValidation;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Backend.Model.Validators;

public class PagingDataValidator : AbstractValidator<PagingData>
{
    public PagingDataValidator()
    {
        RuleFor(p => p.Page).GreaterThan(0);
    }
}