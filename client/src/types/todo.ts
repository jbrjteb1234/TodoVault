//for type files, use export type. export makes it exportable anywhere

type TodoCore = {
    title: string;
    priority: number;
    owner: string;
    category: string;
    dueDate?: string | null;
    notes?: string | null;
};

export type Todo =  TodoCore & {
    id: number;
    isDone: boolean;
};

export type CreateTodoDto = TodoCore;

export type UpdateTodoDto = TodoCore & {
    isDone: boolean;
};