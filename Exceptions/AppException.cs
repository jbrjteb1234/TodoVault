namespace MyWpaProgram.Exceptions;


//derive a public class "AppException" from the "Exception" type
//this allows for the usage of: Message, StackTrace, InnerException
//this mean we can Throw an "AppException"
public class AppException : Exception
{
    public AppException(string message) : base(message) {}

    public AppException(string message, Exception innerException) : base(message, innerException) {} 

    //the : base also calls the base constructor for Exception 
}

//this class gives us the ability to throw a custom exception, giving our own message for context, and then base initializes the message
//field for the technical root cause of the error i.e. json bad format or something

