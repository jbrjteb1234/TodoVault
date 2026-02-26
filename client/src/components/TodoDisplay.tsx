import type { Todo } from "../types/todo.ts";
import { useState } from "react";
import "../styles/TodoDisplay.css"

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
export default function CreateTodoDisplay ( { loading, getError, todoList, setUpdater, updaterTargetId, deleteHandler, deleting, deleteError } : CreateTodoDisplayProps){

    const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set<number>);

    const [sortOrder, setSortOrder] = useState<number>(defaultSort);

    const [searchText, setSearchText] = useState<string>("");

    function expandButtonHandler(id: number): void{
        setExpandedSet((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    }

    function allExpandButtonHandler(action: boolean): void {
        const newSet = new Set<number>();

        if(!action){
            setExpandedSet(newSet);
        }else{
            todoList.forEach((todo) =>
                newSet.add(todo.id)
            )
            setExpandedSet(newSet);
        }
    }

    function getTodoOrder(a: Todo, b: Todo): number {
        switch(sortOrder){
            case prioritySort:
                const priorityDiff =  a.priority - b.priority;
                if(priorityDiff === 0) return a.id - b.id;
                return priorityDiff;
            case dueDateSort:
                const aDueDate = a.dueDate ?? "9999-99-99";
                const bDueDate = b.dueDate ?? "9999-99-99";

                const byDue = aDueDate.localeCompare(bDueDate);
                if(byDue === 0) return a.id-b.id;

                return byDue;
            default:
                return 0;
        }
    }

    return !loading && !getError &&(
        <div className="todoDisplayMain">

            <div className="searchContainer">
                <input className="searchField" type="text" placeholder="Search todos..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}></input>
                <button className="clearSearchButton" type="button" onClick={() => setSearchText("")}>Clear search</button>
            </div>

            <div className="todoDisplayOptions">
                <select className="sortOrderSelect" onChange={(value) => setSortOrder(Number(value.target.value))} value={sortOrder}>
                    <option className="sortOrderOption" value={defaultSort} key={defaultSort}>Sort by</option>
                    <option className="sortOrderOption" value={prioritySort} key={prioritySort}>Sort by priority</option>
                    <option className="sortOrderOption" value={dueDateSort} key={dueDateSort}>Sort by due date</option>
                </select>

                <button className="expandCollapseButton" type="button" onClick={() => allExpandButtonHandler(true)}>{"Expand all"}</button>
                <button className="expandCollapseButton" type="button" onClick={() => allExpandButtonHandler(false)}>{"Collapse all"}</button>
            </div>

            <ul className="todoDisplayList">
                {[...todoList].sort(getTodoOrder).map((todo) => todo.title.includes(searchText) && (
                <li className="todoDisplayTodo" key={todo.id}>
                    <label className="todoDisplayTitle">{todo.title}</label>

                    <button className="todoExpand" onClick={() => {expandButtonHandler(todo.id)}}>{expandedSet.has(todo.id) ? "▾" : "▸"}</button>
                    
                        { expandedSet.has(todo.id) && (
                            <ul className="todoDisplayTodoDetails">
                                {deleteError && (<label className="errorText">Error deleting todo: {deleteError}</label>)}
                                <li className="todoDisplayTodoAttribute">Priority: {todo.priority}</li>
                                <li className="todoDisplayTodoAttribute">Owner: {todo.owner}</li>
                                <li className="todoDisplayTodoAttribute">Description: {todo.description}</li>
                                {todo.dueDate && (<li className="todoDisplayTodoAttribute">Due date: {todo.dueDate}</li>)}
                                {todo.notes && (<li className="todoDisplayTodoAttribute">Notes: {todo.notes}</li>)}
                                <li className="todoDisplayTodoAttribute">Completed:<input className="todoIsDoneCheckbox" type="checkbox" checked={todo.isDone} readOnly></input></li>
                                <button className="todoDisplayTodoUpdateButton" onClick={ updaterTargetId === todo.id ? () => setUpdater(null) : () => setUpdater(todo) }>Update</button>
                                <button  className="todoDisplayTodoDeleteButton" onClick={ () => deleteHandler(todo.id) }>{deleting ? "Deleting..." : "Delete"}</button>
                            </ul>
                        )}
                </li>
                ))}
            </ul>
        </div>
    )
}