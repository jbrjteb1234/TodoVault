namespace MyWpaProgram.Exceptions;

public sealed class ValidationException : Exception
{
    ValidationException(string message) : base(message) {}
}