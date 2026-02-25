//import a TYPE from the file
import { type Todo,type CreateTodoDto, type UpdateTodoDto } from "./types/todo.ts";
import { useEffect, useState } from "react";
import { createTodo, getTodos, updateTodo, deleteTodo } from "./api/TodoApis.ts";
import CreateTodoDisplay from "./components/TodoDisplay.tsx";
import CreateForm from "./components/TodoForm.tsx";
import TodoUpdater from "./components/TodoUpdater.tsx";
import "./styles/app.css"

//Default app to export
export default function App() {
    //State: array of toods loaded onto the frontend
    const [todos, setTodos] = useState<Todo[]>(new Array<Todo>()); //UseState for arrays loaded on the frontend, init to empty array of Todos

    //States: loading a Todo and an error state
    const [loading, setLoading] = useState<boolean>(false);

    const [creating, setCreating] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    const [updaterTarget, setUpdaterTarget] = useState<Todo | null>(null);
    const [creatorActive, setCreatorActive] = useState<boolean>(false);

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

    async function handleCreate(createForm: CreateTodoDto): Promise<void>{
        
        try{
            setCreating(true);
            setCreateError(null);

            const createdTodo:Todo = await createTodo(createForm);

            setTodos((prev) => prev.concat(createdTodo));
            setCreatorActive(false);

        } catch(error) {
            setCreateError(String(error));
        }finally{
            setCreating(false);
        }
    }

    async function handleUpdate(dto: UpdateTodoDto, id: number): Promise<void> {
        try{

            setUpdating(true);
            setUpdateError(null);

            const updatedTodo:Todo = await updateTodo(dto, id)

            //Set todos - map prev (returns a new array after performing callback fn on). if new id == id, then replace
            setTodos(prev => (prev.map(e => (e.id == updatedTodo.id ? updatedTodo : e))));
            setUpdaterTarget(null);

        }catch(error) {
            setUpdateError(String(error));
        }finally{
            setUpdating(false);
        }
    }

    async function handleDelete(id: number): Promise<void> {
        try{

            setDeleting(true);
            setDeleteError(null);

            await deleteTodo(id);

            setTodos((prev) => (prev.filter((e) => (e.id !== id))));

            if(updaterTarget && updaterTarget.id === id){
                setUpdaterTarget(null);
            }

        }catch(error){
            setDeleteError(String(error));
        }finally{
            setDeleting(false);
        }
    }

    return (
        <main className="main">
            <h1 className="mainTitle">TodoVault</h1>

            <TodoUpdater
                todo={updaterTarget}
                onUpdate={handleUpdate}
                updateError={updateError}
                updating={updating}
                hideButton={() => setUpdaterTarget(null)}
            />

            <button className="createButton" onClick={() => setCreatorActive(true)}>Create todo</button>

            {creatorActive && (<CreateForm
                creating={creating}
                createError={createError}
                onCreate={handleCreate}
                hideButton={() => setCreatorActive(false)}
            />)}

            {loading && <p className="laodingTodos">Loading todos...</p>}

            {!loading && getError != null && (
                <p style={{ color: "crimson" }}>
                    Failed to load todos: {getError}
                </p>
            )}

            <CreateTodoDisplay 
                loading={loading}
                getError={getError}
                todoList={todos} 
                deleteHandler={handleDelete} 
                deleting={deleting} 
                deleteError={deleteError} 
                setUpdater={setUpdaterTarget} 
                updaterTargetId={updaterTarget? updaterTarget.id : null}
            />

        </main>
    );

}