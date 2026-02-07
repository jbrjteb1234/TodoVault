//for type files, use export type. export makes it exportable anywhere

export type Todo = {
    id: number;
    title: string;
    isDone: boolean;
    priority: number;
    owner: string;
    category: string;
    dueDate?: string | null;
    notes?: string | null;
};