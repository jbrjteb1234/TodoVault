using System.Collections;
using System.Runtime.CompilerServices;
using MyWpaProgram.Models;

namespace MyWpaProgram.Services;

public sealed class TodoService
{
    // 1: Filter: open (not done) and sort by priority desc, and due date ascending with nulls last

    //This is a method signature. Each LINQ call uses a lambda function as the argument, whcih constitutes the condition

    //We return the most general interface that provides the required operation, giving it flexiblity with other types

    //The last LINQ operation turns it into a list, and list implements IReadOnlyList, therefore making it return an implementation of IReadOnlyList
    public IReadOnlyList<TodoItem> GetOpenSorted(IEnumerable<TodoItem> items)
        => items
            .Where(t => !t.IsDone)
            .OrderByDescending(t => t.Priority)
            .ThenBy(t => t.DueDate ?? DateTime.MaxValue)
            .ToList();
    


}