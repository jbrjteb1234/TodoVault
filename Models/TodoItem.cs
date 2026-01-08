//define namespace
namespace MyWpaProgram.Models;

//implement public sealed record - sealed means you cant inherit from it and create sub-classes,
//record is a data-friendly structure, allowing for two different instance proprties to be equivalent if they have the same value
public sealed record TodoItem(
    int Id,
    string Title,
    bool IsDone,
    int Priority,
    string Owner,
    string Category,
    //the "?" means these values can be nullable
    DateTime? DueDate,
    string? Notes
);