import type { CreateTodoDto, Priority } from "../types/todo";
import { PriorityOptions } from "../types/todo";
import { useState } from "react";
import type React from "react";

type CreateFormProp = {
    creating: boolean,
    createError: string | null,
    onCreate: (dto: CreateTodoDto) => void
};

export default function CreateForm(props: CreateFormProp){

    const [createForm, setCreateForm] = useState<CreateTodoDto>({
        title: "",
        priority: null,
        owner: "",
        category: "",
        dueDate: null,
        notes: null,
    });

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
        props.onCreate(createForm);
    }

    return (
        <form onSubmit={handleSubmit}>
            {props.createError != null && <div style={{color: "crimson"}}>{props.createError}</div>}
            
            <label>Title</label><br></br>
            <input onChange={ (e) => formUpdater(e, "title") }></input><br></br>
            <label>Priority</label><br></br>
            <select onChange={ (e) => formUpdater(e, "priority") } >
                <option value="">Select priority</option>
                {PriorityOptions.map( (p) => <option key={p} value={p} >{p}</option> )}
            </select><br></br>
            <label>Owner</label><br></br>
            <input onChange={ (e) => formUpdater(e, "owner") }></input><br></br>
            <label>Category</label><br></br>
            <input onChange={ (e) => formUpdater(e, "category") }></input><br></br>
            <label>Due date</label><br></br>
            <input type="date" onChange={ (e) => formUpdater(e, "dueDate") }></input><br></br>
            <label>Notes</label><br></br>
            <textarea onChange={ (e) => formUpdater(e, "notes") }></textarea><br></br>
            
            <button type="submit" disabled={props.creating}>
                {props.creating? "Creating..." : "Create"}
            </button> 
        </form>
    );

}