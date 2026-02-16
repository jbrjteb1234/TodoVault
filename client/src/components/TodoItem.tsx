import type { Todo } from "../types/todo.ts";

export default function TodoItem(todo: Todo){
    return (
        <li key={todo.id} style={{ marginBottom: 8 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={todo.isDone} readOnly />
                <span style={{ textDecoration: todo.isDone ? "line-through" : "none" }}>
                    {todo.title}
                </span>
            </label>
        </li>
    );
}