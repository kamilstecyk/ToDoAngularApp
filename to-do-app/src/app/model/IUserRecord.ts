interface Todo{
    content: string;
    notificationTimestamp?: Number
}
export interface IUserRecord{
    id : string;
    todos : string[];
    inProgress : string[];
    done : string[];
}