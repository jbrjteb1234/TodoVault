//import a TYPE from the file
import { type Todo,type CreateTodoDto, type Priority, PriorityOptions } from "./types/todo.ts";
import { useEffect, useState } from "react";
import type React from "react";
import { createTodo, getTodos } from "./api/TodoApis.ts";

const layoutSize = {
    padding: 24,
    fontFamily: "system-ui, sans-serif"
}

//Default app to export
export default function App() {
    //State: array of toods loaded onto the frontend
    const [todos, setTodos] = useState<Todo[]>(new Array<Todo>()); //UseState for arrays loaded on the frontend, init to empty array of Todos

    //States: loading a Todo and an error state
    const [loading, setLoading] = useState<boolean>(false);

    //States: create todo
    const [createForm, setCreateForm] = useState<CreateTodoDto>({
        title: "",
        priority: null,
        owner: "",
        category: "",
        dueDate: null,
        notes: null,
    });
    const [creating, setCreating] = useState<boolean>(false);

    //States: CRUD errors
    const [getError, setGetError] = useState<string | null>(null);    //type is union of string and null
    const [createError, setCreateError] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    //Fetch the TODOs when the component first loads
    useEffect(() => {
        async function loadTodos() {
            try {
                setLoading(true);
                setGetError(null);

                const data: Todo[] = await getTodos();
                setTodos(data);
            } catch(error) {
                setGetError(String(error));
            } finally {
                setLoading(false);
            }
        }

        void loadTodos();
    }, []); //dependancy array - [] means run once when the component first renders

    async function handleCreate(event: React.FormEvent<HTMLFormElement>): Promise<void>{
        event.preventDefault();
        
        try{
            setCreating(true);
            setCreateError(null);

            const createdTodo:Todo = await createTodo(createForm);

            setTodos(todos.concat(createdTodo));

        } catch(error) {
                setCreateError(String(error));
        }finally{
            setCreating(false);
        }
    }

    function parseFormField<T extends keyof CreateTodoDto>(key: T, value: string): CreateTodoDto[T] {
        value = value.trim();
        switch(key){
            case "priority": {
                return (value === "" ? null : Number(value) as Priority) as CreateTodoDto[T];
            }
            case "notes":
            case "dueDate": {
                return (value === "" ? null : value) as CreateTodoDto[T];
            }
            default:
                return value as CreateTodoDto[T];
        }
    }

    function formUpdater<T extends keyof CreateTodoDto>(element: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, key: T){
        setCreateForm( (prev) => ({
            ...prev,
            [key]: parseFormField(key, element.target.value)
        }));
    }

    return (
        <main style={layoutSize}>
            <h1>TodoVault</h1>

            <form onSubmit={handleCreate}>
                {createError != null && <div style={{color: "crimson"}}>{createError}</div>}
                
                <label>Title</label><br></br>
                <input onChange={ (e) => formUpdater(e, "title") }></input><br></br>
                <label>Priority</label><br></br>
                <select onChange={ (e) => formUpdater(e, "priority") } >
                    <option value="">Select priority</option>
                    {PriorityOptions.map( (p) => <option key={p} value={p} >{p}</option> )}
                </select><br></br>
                <label>Owner</label><br></br>
                <input onChange={ (e) => formUpdater(e, "owner") }></input><br></br>
                <label>Category</label><br></br>
                <input onChange={ (e) => formUpdater(e, "category") }></input><br></br>
                <label>Due date</label><br></br>
                <input type="date" onChange={ (e) => formUpdater(e, "dueDate") }></input><br></br>
                <label>Notes</label><br></br>
                <textarea onChange={ (e) => formUpdater(e, "notes") }></textarea><br></br>
                
                <button type="submit" disabled={creating}>
                    {creating? "Creating..." : "Create"}
                </button> 
            </form>

            {loading && <p>Loading todos...</p>}

            {!loading && getError != null && (
                <p style={{ color: "crimson" }}>
                    Failed to load todos: {getError}
                </p>
            )}

            {!loading && !getError && (
                <ul style={{ paddingLeft: 18 }}>
                    {todos.map((todo) => (
                        <li key={todo.id} style={{ marginBottom: 8 }}>
                            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <input type="checkbox" checked={todo.isDone} readOnly />
                                <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>
                                    {todo.title}
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );

}