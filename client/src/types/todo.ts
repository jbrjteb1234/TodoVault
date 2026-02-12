//for type files, use export type. export makes it exportable anywhere

export type Priority = 1 | 2 | 3 | 4 | 5 | null;

type TodoCore = {
    title: string;
    priority: Priority;
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