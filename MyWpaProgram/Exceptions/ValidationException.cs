namespace MyWpaProgram.Exceptions;

public sealed class ValidationException : AppException
{
    ValidationException(string message) : base(message) {}
}