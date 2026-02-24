import type { Todo } from "../types/todo.ts";
import { useState } from "react";

type CreateTodoDisplayProps = {
    loading: boolean
    getError: string | null
    todoList: Todo[];
    setUpdater: (newTarget: Todo | null) => void
    updaterTargetId: number | null
    deleteHandler: (id: number) => Promise<void>
    deleting: boolean
    deleteError: string | null
};

const defaultSort = 0;
const prioritySort = 1;
const dueDateSort = 2;

//This function is a react component, so the argument must be a prop object
export default function createTodoDisplay( { loading, getError, todoList, setUpdater, updaterTargetId, deleteHandler, deleting, deleteError } : CreateTodoDisplayProps){

    const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set<number>);

    const [sortOrder, setSortOrder] = useState<number>(defaultSort);

    function expandButtonHandler(id: number): void{
        setExpandedSet((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    }

    function getTodoOrder(a: Todo, b: Todo): number {
        switch(sortOrder){
            case prioritySort:
                const priorityDiff =  a.priority - b.priority;
                if(priorityDiff === 0) return a.id - b.id;
                return priorityDiff;
            case dueDateSort:
                return 0;
            default:
                return 0;
        }
    }

    return !loading && !getError &&(
        <div>
            <select onChange={(value) => setSortOrder(Number(value.target.value))} value={sortOrder}>
                <option value={defaultSort} key={defaultSort}>Sort by</option>
                <option value={prioritySort} key={prioritySort}>Sort by priority</option>
                <option value={dueDateSort} key={dueDateSort}>Sort by due date</option>
            </select>

            <ul>
                {[...todoList].sort(getTodoOrder).map((todo) => (
                <li key={todo.id}>
                    <label>{todo.title}</label>

                    <button onClick={() => {expandButtonHandler(todo.id)}}/>
                    
                        {expandedSet.has(todo.id) && (
                            <ul>
                                {deleteError && (<label style={{color: "crimson"}}>Error deleting todo: {deleteError}</label>)}
                                <li>Priority: {todo.priority}</li>
                                <li>Owner: {todo.owner}</li>
                                <li>Description: {todo.description}</li>
                                {todo.dueDate && (<li>Due date: {todo.dueDate}</li>)}
                                {todo.notes && (<li>Notes: {todo.notes}</li>)}
                                <li>Completed:<input type="checkbox" checked={todo.isDone} readOnly></input></li>
                                <button onClick={ updaterTargetId == todo.id ? () => setUpdater(null) : () => setUpdater(todo) }>Update</button>
                                <button onClick={ () => deleteHandler(todo.id) }>{deleting ? "Deleting..." : "Delete"}</button>
                            </ul>
                        )}
                </li>
                ))}
            </ul>
        </div>
    )
}