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

    //RepoService wrapper for GetAllAsync for the service's repo
    public Task<IReadOnlyList<TodoItem>> GetAllAsync(CancellationToken ct = default)
        => _repo.GetAllAsync(ct);

    //Use get all async for the deserialized TodoItems, then use the LINQ operation from todoservice to return a sorted result.
    public async Task<IReadOnlyList<TodoItem>> GetOpenSortedAsync(CancellationToken ct = default)
    {
        var items = await _repo.GetAllAsync(ct);
        return _todoService.GetOpenSorted(items);
    }

    public async Task<IReadOnlyList<TodoItem>> GetTopPriorityAsync(int top = 5, CancellationToken ct = default)
    {
        var items = await _repo.GetAllAsync(ct);
        return _todoService.GetTopPriority(items, top);
    }

    public async Task<Dictionary<string, int>> CountByOwnerAsync(CancellationToken ct = default)
    {
        var items = await _repo.GetAllAsync(ct);
        return _todoService.CountByOwner(items);
    }

    public async Task<IReadOnlyList<TodoItem>> GetOverdueAsync(DateTime nowUtc, CancellationToken ct = default)
    {
        var items = await _repo.GetAllAsync(ct);
        return _todoService.GetOverdue(items, nowUtc);
    }

}