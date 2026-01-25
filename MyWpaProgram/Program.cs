using MyWpaProgram.Data;
using MyWpaProgram.Exceptions;
using MyWpaProgram.Services;

namespace MyWpaProgram;

public static class Program
{
    public static async Task Main()
    {
        try
        {
            //build path from the base directory to sample-todos.json
            var JsonPath = Path.Combine(AppContext.BaseDirectory, "Data", "sample-todos.json");
        }
        catch(AppException ex)
        {
            Console.WriteLine("Application Exception: "+ex.Message+"\n\n"+"Information: "+ex.InnerException);
        }
        catch(Exception ex)
        {
            Console.WriteLine("Unexpected error: "+ex.Message);
        }
    }
}