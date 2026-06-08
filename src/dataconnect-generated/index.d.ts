import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  title: string;
  type: string;
  mode: string;
  categoryId?: UUIDString | null;
}

export interface GetRecentProgressData {
  taskProgresses: ({
    date: DateString;
    status: string;
    currentValue?: number | null;
  })[];
}

export interface GetRecentProgressVariables {
  taskId: UUIDString;
}

export interface ListTasksForUserData {
  tasks: ({
    title: string;
    description?: string | null;
    dueDate?: DateString | null;
    category?: {
      name: string;
    };
  })[];
}

export interface LogTaskProgressData {
  taskProgress_insert: TaskProgress_Key;
}

export interface LogTaskProgressVariables {
  taskId: UUIDString;
  date: DateString;
  status: string;
  value?: number | null;
}

export interface TaskProgress_Key {
  id: UUIDString;
  __typename?: 'TaskProgress_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface ListTasksForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTasksForUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTasksForUserData, undefined>;
  operationName: string;
}
export const listTasksForUserRef: ListTasksForUserRef;

export function listTasksForUser(options?: ExecuteQueryOptions): QueryPromise<ListTasksForUserData, undefined>;
export function listTasksForUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTasksForUserData, undefined>;

interface CreateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  operationName: string;
}
export const createTaskRef: CreateTaskRef;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface LogTaskProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogTaskProgressVariables): MutationRef<LogTaskProgressData, LogTaskProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: LogTaskProgressVariables): MutationRef<LogTaskProgressData, LogTaskProgressVariables>;
  operationName: string;
}
export const logTaskProgressRef: LogTaskProgressRef;

export function logTaskProgress(vars: LogTaskProgressVariables): MutationPromise<LogTaskProgressData, LogTaskProgressVariables>;
export function logTaskProgress(dc: DataConnect, vars: LogTaskProgressVariables): MutationPromise<LogTaskProgressData, LogTaskProgressVariables>;

interface GetRecentProgressRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRecentProgressVariables): QueryRef<GetRecentProgressData, GetRecentProgressVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRecentProgressVariables): QueryRef<GetRecentProgressData, GetRecentProgressVariables>;
  operationName: string;
}
export const getRecentProgressRef: GetRecentProgressRef;

export function getRecentProgress(vars: GetRecentProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetRecentProgressData, GetRecentProgressVariables>;
export function getRecentProgress(dc: DataConnect, vars: GetRecentProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetRecentProgressData, GetRecentProgressVariables>;

