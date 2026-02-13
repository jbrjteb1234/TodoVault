//for type files, use export type. export makes it exportable anywhere

export const PriorityOptions = [1,2,3,4,5] as const;
export type Priority = (typeof PriorityOptions)[number] | null;

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