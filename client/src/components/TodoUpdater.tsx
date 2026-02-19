import type { UpdateTodoDto, Todo } from "../types/todo";

type UpdateTodoProp = {
    todo: Todo | null
};

export default function TodoUpdater( { todo }: UpdateTodoProp ){

    return todo != null && (
        <ul>HERE IS THE ID: {todo.id}</ul>
    );
}