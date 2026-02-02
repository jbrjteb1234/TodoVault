using TodoVault.Abstractions;
using TodoVault.Data;
using TodoVault.Models;
using TodoVault.Services;
using TodoVault.Exceptions;

//entry point for asp.net applications - allows for http endpoint hosting
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
        policy.WithOrigins("http://localhost:5000")
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
    //This is a switch expression - look for a pattern, in this case, we compare types of ex 
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
        )
    };
}

//Executes the given async action and returns its IResult
//If it throws AppException, Map it and return the IResult for the error
//IResult is instructions to create http response, for instance, Results.Problem returns an object which is an implementation of IResult.
static async Task<IResult> Handle(Func<Task<IResult>> action)
{
    try
    {
        return await action();
    }
    catch(AppException ex)
    {
        return MapAppException(ex);
    }
}

//Use the frontend CORS policy we established earlier
app.UseCors("frontend");

//These are the endpoints for the app - the API

/*
There are two lambdas nested here.
The outer lambda is the function that the endpoint will call upon a request.
svc (TodoRepositoryService) is supplied by our previous dependency injection (in this case, its a scoped, so unique for each request)
async () => (...) means an asynchronous lambda with 0 arguments
We need the lambda passed to handle to be async so we can await it in handle and wait for the inner function to finish or produce any exceptions
So since we are awaiting the inntermost function (could be svc.GetAllASync), we create our lambda as async so that Handle can also await the result
(since handle is responsibly for catching AppException and then calling MapException)
*/

app.MapGet("/api/todos", (TodoRepositoryService svc, CancellationToken ct)
    => Handle(async () => Results.Ok(await svc.GetAllAsync(ct))));

app.MapGet("/api/todos/open", (TodoRepositoryService svc, CancellationToken ct)
    => Handle(async () => Results.Ok(await svc.GetOpenSortedAsync(ct))));

app.MapGet("/api/todos/top", (int? top, TodoRepositoryService svc, CancellationToken ct)
    => Handle(async () => Results.Ok(await svc.GetTopPriorityAsync(top ?? 5, ct))));

app.MapGet("/api/todos/overdue", (TodoRepositoryService svc, CancellationToken ct)
    => Handle(async () => Results.Ok(await svc.GetOverdueAsync(DateTime.UtcNow, ct))));

app.MapGet("/api/todos/count-by-owner", (TodoRepositoryService svc, CancellationToken ct)
    => Handle(async () => Results.Ok(await svc.CountByOwnerAsync(ct))));

//Get by ID

app.MapGet("/api/todos/{id:int}", (int id, TodoRepositoryService svc, CancellationToken ct) 
    => Handle(async () => Results.Ok(await svc.GetByIdAsync(id, ct))));

//Create

app.MapPost("/api/todos", (TodoCreateDto dto, TodoRepositoryService svc, CancellationToken ct)
    => Handle(async () =>
        {
            var created = await svc.CreateAsync(dto, ct);
            return  Results.Created($"/api/todos/{created.Id}", created);
        }));

app.MapPut("/api/todos/{id:int}", (int id, TodoUpdateDto dto, TodoRepositoryService svc, CancellationToken ct)
    => Handle(async () =>
        {
            var updated = await svc.UpdateAsync(id, dto, ct);
            return Results.Ok(updated);
        }));

app.MapDelete("/api/todos/{id:int}", (int id, TodoRepositoryService svc, CancellationToken ct)
    => Handle(async () => 
        {
            await svc.DeleteAsync(id, ct);
            return Results.NoContent();
        }));

        

app.Run();