namespace MyWpaProgram.Abstractions;

public interface IRepository<T>
{
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);

    Task SaveAllAsync(IReadOnlyList<T> items, CancellationToken ct = default);
}

/*

IRepository<T> = generic interface - T could be anything

The type for this interface method:
      Task = async method: Task<TYPE>
      IReadOnlyList = Read only list: IReadOnlyList<TYPE>

The argument of this method:
    CancellationToken = .NET way of letting an async method cancel. Not a kill switch, but allows it to stop ealry
    default = default value, so for ct its dont cancel/not cancellable

*/