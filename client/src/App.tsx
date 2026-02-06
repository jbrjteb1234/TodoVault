//import a TYPE from the file
import type { Todo } from "./types/todo.ts";
import { useEffect, useState } from "react";
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
    const [error, setError] = useState<string | null>(null);    //type is union of string and null

    //States: create todo
    const [newTitle, setNewTitle] = useState<string>("");
    const [creating, setCreating] = useState<boolean>(false);

    //Fetch the TODOs when the component first loads
    useEffect(() => {
        async function loadTodos() {
            try {
                setLoading(true);
                setError(null);

                const data: Todo[] = await getTodos();
                setTodos(data);
            } catch(error) {
                setError(String(error));
            } finally {
                setLoading(false);
            }
        }

        void loadTodos();
    }, []); //dependancy array - [] means run once when the component first renders

    async function handleCreate(event: React.FormEvent<HTMLFormElement>): Promise<void>{
        event.preventDefault();
        
        const trimmedTitle = newTitle.trim();
        if(trimmedTitle.length == 0) return;

        try{
            setCreating(true);
            setError(null);

            const createdTodo:Todo = await createTodo(trimmedTitle);

            setTodos(todos.concat(createdTodo));
            setNewTitle("");

        } catch(error) {
                setError(String(error));
        }finally{
            setCreating(false);
        }
    }

    return (
        <main style={layoutSize}>
            <h1>TodoVault</h1>

            <form onSubmit={handleCreate}>
                {error != null && <div style={{color: "crimson"}}>Error when creating todo</div>}
                <input onChange={(element) => setNewTitle(element.target.value)}></input>
                <button type="submit" disabled={creating}>
                    {creating? "Creating..." : "Create"}
                </button> 
            </form>

            {loading && <p>Loading todos...</p>}

            {!loading && error != null && (
                <p style={{ color: "crimson" }}>
                    Failed to load todos: {error}
                </p>
            )}

            {!loading && !error && (
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