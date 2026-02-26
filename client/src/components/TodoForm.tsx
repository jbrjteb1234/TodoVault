import type { CreateTodoDto, Priority } from "../types/todo";
import { PriorityOptions } from "../types/todo";
import { useState, useEffect } from "react";
import type React from "react";
import "../styles/TodoForm.css"

/*

value: The todo to pre-fill the form with
creating: used by the parent to represent if the system is currently creating a todo
createError: used by the parent to represent an error which is thrown here
onCreate: passes the dto to the parent for it to handle creation
resetKey: if this changes, then a different default "value (createTodoDto)"
children: any extra fields/react stuff which needs injection

*/

type CreateFormProp = {
    value?: CreateTodoDto
    creating: boolean,
    createError: string | null,
    onCreate: (dto: CreateTodoDto) => void,
    resetKey?: number,
    children?: React.ReactNode
    hideButton: () => void
};

let empty:CreateTodoDto = {
    title: "",
    priority: null,
    owner: "",
    description: "",
    dueDate: null,
    notes: null,
}

export default function CreateForm(props: CreateFormProp){

    const defaultValue = props.value || empty

    const [createForm, setCreateForm] = useState<CreateTodoDto>(defaultValue);

    useEffect(()=>{
        setCreateForm(props.value ?? empty)
    }, [props.resetKey]);

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

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCreateForm(defaultValue);
        props.onCreate(createForm);
    }

    return (
        <div className="modelOverlay">
            <form className="todoForm" onSubmit={handleSubmit}>
                {props.createError != null && <div style={{color: "crimson"}}>{props.createError}</div>}
                
                <div className="todoFormTitle">
                    <label className="todoFormSubtitle">Title</label>
                    <input className="todoFormTextInput" onChange={ (e) => formUpdater(e, "title") } value={createForm.title}></input>
                </div>
                
                <div className="todoFormPriority">
                    <label className="todoFormSubtitle">Priority</label>
                    <select onChange={ (e) => formUpdater(e, "priority") } value={String(createForm.priority)}>
                        <option value="">Select priority</option>
                        {PriorityOptions.map( (p) => <option key={p} value={p} >{p}</option> )}
                    </select>
                </div>
                
                <div className="todoFormOwner">
                    <label className="todoFormSubtitle">Owner</label>
                    <input className="todoFormTextInput" onChange={ (e) => formUpdater(e, "owner") } value={createForm.owner}></input>
                </div>
                
                <div className="todoFormDescription">
                    <label className="todoFormSubtitle">Description</label>
                    <textarea className="todoFormTextTextArea" onChange={ (e) => formUpdater(e, "description") } value={createForm.description}></textarea>
                </div>
                
                <div className="todoFormDueDate">
                    <label className="todoFormSubtitle">Due date</label>
                    <input className="todoFormTextInput" type="date" onChange={ (e) => formUpdater(e, "dueDate") } value={createForm.dueDate ?? ""}></input>
                </div>
                
                <div className="todoFormNotes">
                    <label className="todoFormSubtitle">Notes</label>
                    <textarea className="todoFormTextTextArea" onChange={ (e) => formUpdater(e, "notes") } value={createForm.notes ?? ""}></textarea>
                    {props.children}
                </div>
                
                <button className="todoFormCreateButton" type="submit" disabled={props.creating}>
                    {props.creating? "Creating..." : "Create"}
                </button>
                <button className="todoFormDeleteButton" type="button" onClick={props.hideButton}>
                    Close
                </button>
            </form>
        </div>
    );

}