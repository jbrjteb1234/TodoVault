using System.Text.Json;
using MyWpaProgram.Abstractions;
using MyWpaProgram.Models;
using MyWpaProgram.Exceptions;

namespace MyWpaProgram.Data;

//public class, sealed (cannot derive from), and this is derived from the interface IRepository, with the given type TodoItem (the record we defined)
public sealed class JsonFileRepository : IRepository<TodoItem>
{
    private readonly string _jsonPath;

    //Set the property JsonOptions. Make it static (belongs to the type/class, not the instance) 
    private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions()
    {
        PropertyNameCaseInsensitive = true
    };

    //constructor
    public JsonFileRepository(string jsonPath)
    {
        _jsonPath = jsonPath;
    }

    //GetAllAsync implementation from IRepository
    //ASync methods must return Task<>. This represents a future state, so any caller can await it and wait for the result
    public async Task<IReadOnlyList<TodoItem>> GetAllASync(CancellationToken ct = default)
    {
        try
        {
            //throw custom exception if file not found
            if (!File.Exists(_jsonPath))
                throw new AppException("File sample-todos.json not found");

            //using means it will automatically dispose when we leave the scope
            await using FileStream stream = File.OpenRead(_jsonPath);

            //deserialize the file stream into a List of todoItems
            var items = await JsonSerializer.DeserializeAsync<List<TodoItem>>(stream, JsonOptions, ct);

            return items ?? [];
        }

        catch(JsonException ex)
        {
            throw new AppException("Invalid JSON format in sample-todos.json.", ex);
        }

        catch(IOException ex)
        {
            throw new AppException("Failed to read JSON file sample-todos.json", ex);
        }
    }
}