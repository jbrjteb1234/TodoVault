import type { UpdateTodoDto, Todo, CreateTodoDto } from "../types/todo";
import TodoCreateForm from "./TodoCreator";
import { useState } from "react"

type UpdateTodoProp = {
    todo: Todo | null
    onUpdate: (dto: UpdateTodoDto, id: number) => Promise<void>
    updateError: string | null
    updating: boolean
};

export default function TodoUpdater( { todo,onUpdate,updateError,updating }: UpdateTodoProp ){

    const [formIsDone, setFormIsDone] = useState<boolean>(false);
    
    if(!todo) return;

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
        />

    );
}