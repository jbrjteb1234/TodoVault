using MyWpaProgram.Abstractions;
using MyWpaProgram.Data;
using MyWpaProgram.Models;
using MyWpaProgram.Services;
using MyWpaProgram.Exceptions;

//entry point for asp.net applications - allows for http endpoint hosting
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins("http://localhost:5500", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
    );
});

//Register the repository in Dependancy Injection

//AddSingleton means it gives the same single instance for the entire lifetime of the app (So the same JsonFileRepository, since it inherits from IRepository)
builder.Services.AddSingleton<IRepository<TodoItem>>(sp =>
{
    var env = sp.GetRequiredService<IHostEnvironment>();    //DI is giving access to IHostEnvironment, which contains useful info about the app
    var jsonPath = Path.Combine(env.ContentRootPath, "Data", "sample-todos.json");  //Builds a path to sample-todos.json (OS-safe)
    return new JsonFileRepository(jsonPath);    //Creates the actual repository instance (JsonFileRepository inherits from IRepository<TodoItem>)
});

//Scoped means one instance per HTTP request
builder.Services.AddScoped<TodoService>();
builder.Services.AddScoped<TodoRepositoryService>();

//What these services are doing is basically saying "When this type is asked for, make sure it is registered with the DI

//Singleton - Persists indefinitely, Scoped - Instantiates on HTTP request, Transient - Fresh for every object resolution/call

var app = builder.Build();

//Exception mapping - knowing what to return based on the type of exception
static IResult MapAppException(AppException ex)
{
    //This is a switch statement, not an expression - look for a pattern, in this case, we compare types of ex 
    return ex switch
    {   
        //For each hand, call the method Result.Problem
        ValidationException ve => Results.Problem(
            title: "Validation failed",
            detail: ve.Message,
            statusCode: StatusCodes.Status400BadRequest
        ),

        NotFoundException nfe => Results.Problem(
            title: "Missing resource",
            detail: nfe.Message,
            statusCode: StatusCodes.Status404NotFound
        ),

        //This is the handler for a plain AppException
        _ => Results.Problem(
            title: "Internal server error",
            detail: ex.Message,
            statusCode: StatusCodes.Status500InternalServerError
        ),
    };
}

//Use the frontend CORS policy we established earlier
app.UseCors("frontend");

//These are the endpoints for the app - the API
app.MapGet("/api/todos", async (TodoRepositoryService svc, CancellationToken ct)
    => Results.Ok(await svc.GetAllAsync(ct)));

app.MapGet("/api/todos/open", async (TodoRepositoryService svc, CancellationToken ct)
    => Results.Ok(await svc.GetOpenSortedAsync(ct)));

app.MapGet("/api/todos/top", async (int? top, TodoRepositoryService svc, CancellationToken ct)
    => Results.Ok(await svc.GetTopPriorityAsync(top ?? 5, ct)));

app.MapGet("/api/todos/overdue", async (TodoRepositoryService svc, CancellationToken ct)
    => Results.Ok(await svc.GetOverdueAsync(DateTime.UtcNow, ct)));

app.MapGet("/api/todos/count-by-owner", async (TodoRepositoryService svc, CancellationToken ct)
    => Results.Ok(await svc.CountByOwnerAsync(ct)));

app.Run();