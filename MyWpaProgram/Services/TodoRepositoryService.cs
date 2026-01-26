using MyWpaProgram.Abstractions;
using MyWpaProgram.Models;

namespace MyWpaProgram.Services;

public sealed class TodoRepositoryService
{
    private readonly IRepository<TodoItem> _repo;
    private readonly TodoService _todoService;

    //takes 
    public TodoRepositoryService(IRepository<TodoItem> repo, TodoService todoService)
    {
        _repo = repo;
        _todoService = todoService;
    }

}