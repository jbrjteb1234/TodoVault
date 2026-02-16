import type { Todo } from "../types/todo.ts";
import { useState } from "react";

type CreateTodoDisplayProps = {
  todo: Todo;
};

//This function is a react component, so the argument must be a prop object
export default function createTodoDisplay({todo}: CreateTodoDisplayProps){

    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <li key={todo.id} style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={todo.isDone} readOnly />
                <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>
                    {todo.title}
                </span>

                <br></br>

                <ul>
                    
                </ul>

            </label>
        </li>
    );
}