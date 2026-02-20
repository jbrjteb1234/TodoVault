import type { Todo } from "../types/todo.ts";
import { useState } from "react";

type CreateTodoDisplayProps = {
  todo: Todo;
  setUpdater: (newTarget: Todo | null) => void
  updaterTargetId: number | null
  deleteHandler: (id: number) => Promise<void>
  deleting: boolean
  deleteError: string | null
};

//This function is a react component, so the argument must be a prop object
export default function createTodoDisplay( { todo, setUpdater, updaterTargetId, deleteHandler, deleting, deleteError } : CreateTodoDisplayProps){

    const [expanded, setExpanded] = useState<boolean>(false);

    function expandButtonHandler(): void{
        setExpanded(!expanded);
    }

    return (
        <li key={todo.id}>
            <label>{todo.title}</label>

            <button onClick={expandButtonHandler}/>

            {expanded && (
                <ul>
                    {deleteError && (<label style={{color: "crimson"}}>Error deleting todo: {deleteError}</label>)}
                    <li>Priority: {todo.priority}</li>
                    <li>Owner: {todo.owner}</li>
                    <li>Category: {todo.category}</li>
                    {todo.dueDate && (<li>Due date: {todo.dueDate}</li>)}
                    {todo.notes && (<li>Notes: {todo.notes}</li>)}
                    <li>Completed:<input type="checkbox" checked={todo.isDone} readOnly></input></li>
                    <button onClick={ updaterTargetId == todo.id ? () => setUpdater(null) : () => setUpdater(todo) }>Update</button>
                    <button onClick={ () => deleteHandler(todo.id) }>{deleting ? "Deleting..." : "Delete"}</button>
                </ul>
            )}
        </li>
    );
}