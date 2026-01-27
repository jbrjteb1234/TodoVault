using MyWpaProgram.Abstractions;
using MyWpaProgram.Models;
using MyWpaProgram.Exceptions;

namespace MyWpaProgram.Services;

public sealed class TodoRepositoryService
{
    private readonly IRepository<TodoItem> _repo;
    private readonly TodoService _todoService;

    //Protects read-modify-write for concurrency
    private static readonly SemaphoreSlim writeGate = new(1,1);

    //takes 
    public TodoRepositoryService(IRepository<TodoItem> repo, TodoService todoService)
    {
        _repo = repo;
        _todoService = todoService;
    }

    //RepoService wrapper for GetAllAsync for the service's repo
    public Task<IReadOnlyList<TodoItem>> GetAllAsync(CancellationToken ct = default)
        => _repo.GetAllAsync(ct);

    
    // --------------------------- READS ---------------------------
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

    // --------------------------- WRITES --------------------------- 

    //validate → lock → read list → generate id → add → save → return new item
    public async Task<TodoItem> CreateAsync(TodoCreateDto dto, CancellationToken ct)
    {
        //Validate the DTO
        ValidateTitle(dto.Title);
        ValidatePriority(dto.Priority);
        ValidateRequired(dto.Owner, "Owner");
        ValidateRequired(dto.Category, "Category");

        await writeGate.WaitAsync(ct);
        try{
            //copy the IReadOnlyList from GetAllAsync into a mutable list to operate on
            var list = (await _repo.GetAllAsync(ct)).ToList();

            //generate id: if empty then 1 or the max id + 1
            var nextId = list.Count == 0 ? 1 : list.Max(t => t.Id) + 1;

            TodoItem created = new TodoItem(
                Id: nextId,
                Title: dto.Title.Trim(),
                IsDone: false,
                Priority: dto.Priority,
                Owner: dto.Owner.Trim(),
                Category: dto.Category.Trim(),
                DueDate: dto.DueDate,
                Notes: string.IsNullOrWhiteSpace(dto.Notes) ? null : dto.Notes //treat a dto.Notes of whitespace as null
            );

            list.Add(created);
            await _repo.SaveAllAsync( list, ct );
            return created;
        }
        finally //finally runs when the try block exits
        {
            writeGate.Release();
        }
    }

    //validate → lock → read list → find by id → replace record → save → return updated (or null)
    public async Task<TodoItem?> UpdateAsync(int id, TodoUpdateDto dto, CancellationToken ct)
    {
        
    }

    //lock → read list → remove → save → return bool
    public async Task<bool> DeleteAsync(int id, CancellationToken ct)
    {
        
    }

    // ---------------- VALIDATION HELPERS ----------------

    private static void ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Title must not be empty.");
    }

    private static void ValidateRequired(string value, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ValidationException($"{fieldName} must not be empty.");
    }

    private static void ValidatePriority(int priority)
    {
        if (priority < 1 || priority > 5)
            throw new ValidationException("Priority must be between 1 and 5.");
    }

    private static void ValidateId(int id)
    {
        if (id < 0)
        {
            throw new ValidationException("ID must be greater than 0");
        }
    }

}