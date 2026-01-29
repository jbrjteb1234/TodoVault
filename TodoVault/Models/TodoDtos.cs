namespace TodoVault.Models;

//Client provides everything except Id and IsDone (IsDone defaults false on create)
public sealed record TodoCreateDto(
    string Title,
    int Priority,
    string Owner,
    string Category,
    DateTime? DueDate,
    string? Notes
);

//For simplicity: PUT replaces all fields except Id
public sealed record TodoUpdateDto(
    string Title,
    bool IsDone,
    int Priority,
    string Owner,
    string Category,
    DateTime? DueDate,
    string? Notes
);