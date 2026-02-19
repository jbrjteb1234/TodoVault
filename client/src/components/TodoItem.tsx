import type { Todo } from "../types/todo.ts";
import { useState } from "react";

type CreateTodoDisplayProps = {
  todo: Todo;
  setUpdater: (newTarget: Todo | null) => void
  updaterTargetId: number | null
};

//This function is a react component, so the argument must be a prop object
export default function createTodoDisplay( { todo, setUpdater, updaterTargetId } : CreateTodoDisplayProps){

    const [expanded, setExpanded] = useState<boolean>(false);

    function expandButtonHandler(): void{
        setExpanded(!expanded);
    }

    return (
        <li key={todo.id}>
            <label>{todo.title}</label>

            <button onClick={expandButtonHandler}/>

            <button onClick={ updaterTargetId == todo.id ? () => setUpdater(null) : () => setUpdater(todo) }>Update</button>
            
            {expanded && (
                <ul>
                    <li>Priority: {todo.priority}</li>
                    <li>Owner: {todo.owner}</li>
                    <li>Category: {todo.category}</li>
                    {todo.dueDate && (<li>Due date: {todo.dueDate}</li>)}
                    {todo.notes && (<li>Notes: {todo.notes}</li>)}
                </ul>
            )}
        </li>
    );
}