import type { Priority, Todo, CreateTodoDto, UpdateTodoDto } from "../types/todo.ts";

const todoURL = "/api/todos"    //our vite proxy which will forward to backend

function getTodoUrl(id: number): string{
    return `${todoURL}/${id}`
}

export async function getTodos(): Promise<Todo[]> {     //Promise<Todo[]> = Task<Todo[]> in C#
    
    const response = await fetch(todoURL, {   //fetch = browsers built-in http request function
        method: "GET",
        headers: {
            accept: "application/json"
        }
    });

    if(!response.ok){
        const bodyText:string = await response.text();
        const status:number = response.status;
        throw new Error(`Failed to perform GET request at URL ${todoURL}. Status: ${status}, Body: ${bodyText}.`);
    }

    const data:Todo[] = (await response.json()) as Todo[];  //response.json() is async as well, so await the json, and expect it as a list of Todo type

    return data;

}

export async function createTodo(dto: CreateTodoDto): Promise<Todo> {
    
    const response = await fetch(todoURL, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(dto)
    });

    if(!response.ok){
        const text:string = await response.text();
        const errorCode:number = response.status;
        throw new Error(`Failed to create todo at URL ${todoURL}. Status: ${errorCode}. Message: ${text}`);
    }

    return (await response.json()) as Todo;

}

export async function updateTodo(dto: UpdateTodoDto, id: number): Promise<Todo> {

    let url = getTodoUrl(id);

    let response = await fetch(url, {
        method: "PUT",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(dto)
    });

    if(!response.ok){
        const text = await response.text();
        const errorCode = response.status;
        throw new Error(`Failed to update Todo ${id}. Error code: ${errorCode}`);
    }

    return (await response.json()) as Todo;

}