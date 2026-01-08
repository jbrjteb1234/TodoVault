namespace MyWpaProgram.Abstractions;

public interface IRepository<T>
{
    Task<IReadOnlyList<T>> GetAllASync(CancellationToken ct = default);
}

//IRepository<T> = generic interface - T could be anything
//Task is an async method