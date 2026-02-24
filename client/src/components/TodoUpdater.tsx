import type { UpdateTodoDto, Todo, CreateTodoDto } from "../types/todo";
import TodoCreateForm from "./TodoForm";
import { useState } from "react"

type UpdateTodoProp = {
    todo: Todo | null
    onUpdate: (dto: UpdateTodoDto, id: number) => Promise<void>
    updateError: string | null
    updating: boolean
    hideButton: () => void
};

export default function TodoUpdater( { todo,onUpdate,updateError,updating,hideButton }: UpdateTodoProp ){

    const [formIsDone, setFormIsDone] = useState<boolean>(false);
    
    if(!todo) return null;

    const { id, ...updateDto } = todo;
    const { isDone, ...createDto } = updateDto;


    function onCreateWrapper(createDto: CreateTodoDto){
        let updateDto:UpdateTodoDto = {isDone:formIsDone, ...createDto};
        onUpdate(updateDto, id);
    }

    return (

        <TodoCreateForm
            value={createDto}
            creating={updating}
            createError={updateError}
            onCreate={onCreateWrapper}
            resetKey={id}
            hideButton={hideButton}
        >
            <label className="todoFormSubtitle">Done</label><br />
            <input
                className="todoFormCheckbock"
                type="checkbox"
                checked={formIsDone}
                onChange={(e) => setFormIsDone(e.target.checked)}
            />
            <br />
        </TodoCreateForm>

    );
}