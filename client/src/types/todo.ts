//for type files, use export type. export makes it exportable anywhere

export const PriorityOptions = [1,2,3,4,5] as const;
export type Priority = (typeof PriorityOptions)[number];

export type TodoCore = {
    title: string;
    owner: string;
    description: string;
    dueDate?: string | null;
    notes?: string | null;
};

export type Todo =  TodoCore & {
    priority: Priority;
    id: number;
    isDone: boolean;
};

export type CreateTodoDto = TodoCore & {
    priority: Priority | null;
};

export type UpdateTodoDto = TodoCore & {
    priority: Priority | null;
    isDone: boolean;
};