//import a TYPE from the file
import type { Todo } from "./types/todo.ts";
import { useEffect, useState} from "react";
import { getTodos } from "./api/TodoApis.ts";

const layoutSize = {
    padding: 24,
    fontFamily: "system-ui, sans-serif"
}

//Default app to export
export default function App(){
    //State: array of toods loaded onto the frontend
    const [todos, setTodos] = useState<Todo[]>( new Array<Todo>() ); //UseState for arrays loaded on the frontend, init to empty array of Todos

    //States: loading a Todo and an error state
    const [loading, setLoading] = useState<boolean>( false );
    const [error, setError] = useState<string | null>(null);    //type is a union of string and null

    //Fetch the TODOs when the component first loads
    useEffect(() => {
        async function loadTodos(){
            try{
                setLoading(true);
                setError(null);

                const data:Todo[] = await getTodos();
                setTodos(data);
            }catch{
                setError("Failed to fetch Todos.")
            }finally{
                setLoading(false);
            }
        }

        void loadTodos();
    }, []); //dependancy array - [] means run once when the component first renders
    
    return (
        <main style={layoutSize}>
            <h1>TodoVault</h1>
        </main>
    )

}