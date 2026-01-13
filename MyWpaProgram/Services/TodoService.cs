using System.Collections;
using System.Runtime.CompilerServices;
using MyWpaProgram.Models;

namespace MyWpaProgram.Services;

public sealed class TodoService
{

    //This is a method signature. Each LINQ call uses a lambda function as the argument, whcih constitutes the condition/information

    //We return the most general interface that provides the required operation, giving it flexiblity with other types

    //The last LINQ operation turns it into a list, and list implements IReadOnlyList, therefore making it return an implementation of IReadOnlyList


    // 1: Filter: open (not done) and sort by priority desc, and due date ascending with nulls last
    public IReadOnlyList<TodoItem> GetOpenSorted(IEnumerable<TodoItem> items)
        => items
            .Where(t => !t.IsDone)
            .OrderByDescending(t => t.Priority)
            .ThenBy(t => t.DueDate ?? DateTime.MaxValue)
            .ToList();

    // 2: Take top N by priority
    public IReadOnlyList<TodoItem> GetTopPriority(IEnumerable<TodoItem> items, int top = 5)
        => items
            .OrderByDescending(t => t.Priority)
            .ThenBy(t => t.DueDate ?? DateTime.MaxValue)
            .Take(top)
            .ToList();
    
    // 3: Grouping: count tasks by owner (Dictionary practice)
    public Dictionary<string, int> CountByOwner(IEnumerable<TodoItem> items)
        => items
            .GroupBy(t => t.Owner)
            .ToDictionary(g => g.Key, g => g.Count());

    // 4: Optional: overdue tasks (due date exists and is in the past, and not done)
    public IReadOnlyList<TodoItem> GetOverdue(IEnumerable<TodoItem> items, DateTime nowUtc)
        => items
            .Where(t => !t.IsDone && t.DueDate is not null && t.DueDate.Value < nowUtc)
            .OrderBy(t => t.DueDate)
            .ToList();
    


}