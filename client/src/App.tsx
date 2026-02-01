//import a TYPE from the file
import type { Todo } from "./types/todo.ts";

const layoutSize = {
    padding: 24,
    fontFamily: "system-ui, sans-serif"
}

//array of the type Todo
const sampleTodos: Todo[] = [
    { id: 1, title: "Wire up frontend scaffold", isDone: true },
    { id: 2, title: "Create Todo list UI", isDone: false },
    { id: 3, title: "Connect to API", isDone: false },
];

//Default app to export
export default function App(){
    return (
        <main style={layoutSize}>
            <h1>TodoVault</h1>
            <p>Frontend scaffold is running.</p>
        </main>
    )
}