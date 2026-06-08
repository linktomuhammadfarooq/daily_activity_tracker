# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListTasksForUser*](#listtasksforuser)
  - [*GetRecentProgress*](#getrecentprogress)
- [**Mutations**](#mutations)
  - [*CreateTask*](#createtask)
  - [*LogTaskProgress*](#logtaskprogress)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListTasksForUser
You can execute the `ListTasksForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTasksForUser(options?: ExecuteQueryOptions): QueryPromise<ListTasksForUserData, undefined>;

interface ListTasksForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTasksForUserData, undefined>;
}
export const listTasksForUserRef: ListTasksForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTasksForUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTasksForUserData, undefined>;

interface ListTasksForUserRef {
  ...
  (dc: DataConnect): QueryRef<ListTasksForUserData, undefined>;
}
export const listTasksForUserRef: ListTasksForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTasksForUserRef:
```typescript
const name = listTasksForUserRef.operationName;
console.log(name);
```

### Variables
The `ListTasksForUser` query has no variables.
### Return Type
Recall that executing the `ListTasksForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTasksForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListTasksForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTasksForUser } from '@dataconnect/generated';


// Call the `listTasksForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTasksForUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTasksForUser(dataConnect);

console.log(data.tasks);

// Or, you can use the `Promise` API.
listTasksForUser().then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

### Using `ListTasksForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTasksForUserRef } from '@dataconnect/generated';


// Call the `listTasksForUserRef()` function to get a reference to the query.
const ref = listTasksForUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTasksForUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tasks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tasks);
});
```

## GetRecentProgress
You can execute the `GetRecentProgress` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getRecentProgress(vars: GetRecentProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetRecentProgressData, GetRecentProgressVariables>;

interface GetRecentProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRecentProgressVariables): QueryRef<GetRecentProgressData, GetRecentProgressVariables>;
}
export const getRecentProgressRef: GetRecentProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRecentProgress(dc: DataConnect, vars: GetRecentProgressVariables, options?: ExecuteQueryOptions): QueryPromise<GetRecentProgressData, GetRecentProgressVariables>;

interface GetRecentProgressRef {
  ...
  (dc: DataConnect, vars: GetRecentProgressVariables): QueryRef<GetRecentProgressData, GetRecentProgressVariables>;
}
export const getRecentProgressRef: GetRecentProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRecentProgressRef:
```typescript
const name = getRecentProgressRef.operationName;
console.log(name);
```

### Variables
The `GetRecentProgress` query requires an argument of type `GetRecentProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetRecentProgressVariables {
  taskId: UUIDString;
}
```
### Return Type
Recall that executing the `GetRecentProgress` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRecentProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetRecentProgressData {
  taskProgresses: ({
    date: DateString;
    status: string;
    currentValue?: number | null;
  })[];
}
```
### Using `GetRecentProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRecentProgress, GetRecentProgressVariables } from '@dataconnect/generated';

// The `GetRecentProgress` query requires an argument of type `GetRecentProgressVariables`:
const getRecentProgressVars: GetRecentProgressVariables = {
  taskId: ..., 
};

// Call the `getRecentProgress()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRecentProgress(getRecentProgressVars);
// Variables can be defined inline as well.
const { data } = await getRecentProgress({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRecentProgress(dataConnect, getRecentProgressVars);

console.log(data.taskProgresses);

// Or, you can use the `Promise` API.
getRecentProgress(getRecentProgressVars).then((response) => {
  const data = response.data;
  console.log(data.taskProgresses);
});
```

### Using `GetRecentProgress`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRecentProgressRef, GetRecentProgressVariables } from '@dataconnect/generated';

// The `GetRecentProgress` query requires an argument of type `GetRecentProgressVariables`:
const getRecentProgressVars: GetRecentProgressVariables = {
  taskId: ..., 
};

// Call the `getRecentProgressRef()` function to get a reference to the query.
const ref = getRecentProgressRef(getRecentProgressVars);
// Variables can be defined inline as well.
const ref = getRecentProgressRef({ taskId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRecentProgressRef(dataConnect, getRecentProgressVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.taskProgresses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.taskProgresses);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateTask
You can execute the `CreateTask` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface CreateTaskRef {
  ...
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
}
export const createTaskRef: CreateTaskRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTaskRef:
```typescript
const name = createTaskRef.operationName;
console.log(name);
```

### Variables
The `CreateTask` mutation requires an argument of type `CreateTaskVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTaskVariables {
  title: string;
  type: string;
  mode: string;
  categoryId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `CreateTask` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTaskData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTaskData {
  task_insert: Task_Key;
}
```
### Using `CreateTask`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTask, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  type: ..., 
  mode: ..., 
  categoryId: ..., // optional
};

// Call the `createTask()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTask(createTaskVars);
// Variables can be defined inline as well.
const { data } = await createTask({ title: ..., type: ..., mode: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTask(dataConnect, createTaskVars);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
createTask(createTaskVars).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

### Using `CreateTask`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTaskRef, CreateTaskVariables } from '@dataconnect/generated';

// The `CreateTask` mutation requires an argument of type `CreateTaskVariables`:
const createTaskVars: CreateTaskVariables = {
  title: ..., 
  type: ..., 
  mode: ..., 
  categoryId: ..., // optional
};

// Call the `createTaskRef()` function to get a reference to the mutation.
const ref = createTaskRef(createTaskVars);
// Variables can be defined inline as well.
const ref = createTaskRef({ title: ..., type: ..., mode: ..., categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTaskRef(dataConnect, createTaskVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.task_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.task_insert);
});
```

## LogTaskProgress
You can execute the `LogTaskProgress` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
logTaskProgress(vars: LogTaskProgressVariables): MutationPromise<LogTaskProgressData, LogTaskProgressVariables>;

interface LogTaskProgressRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: LogTaskProgressVariables): MutationRef<LogTaskProgressData, LogTaskProgressVariables>;
}
export const logTaskProgressRef: LogTaskProgressRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
logTaskProgress(dc: DataConnect, vars: LogTaskProgressVariables): MutationPromise<LogTaskProgressData, LogTaskProgressVariables>;

interface LogTaskProgressRef {
  ...
  (dc: DataConnect, vars: LogTaskProgressVariables): MutationRef<LogTaskProgressData, LogTaskProgressVariables>;
}
export const logTaskProgressRef: LogTaskProgressRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the logTaskProgressRef:
```typescript
const name = logTaskProgressRef.operationName;
console.log(name);
```

### Variables
The `LogTaskProgress` mutation requires an argument of type `LogTaskProgressVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface LogTaskProgressVariables {
  taskId: UUIDString;
  date: DateString;
  status: string;
  value?: number | null;
}
```
### Return Type
Recall that executing the `LogTaskProgress` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LogTaskProgressData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LogTaskProgressData {
  taskProgress_insert: TaskProgress_Key;
}
```
### Using `LogTaskProgress`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, logTaskProgress, LogTaskProgressVariables } from '@dataconnect/generated';

// The `LogTaskProgress` mutation requires an argument of type `LogTaskProgressVariables`:
const logTaskProgressVars: LogTaskProgressVariables = {
  taskId: ..., 
  date: ..., 
  status: ..., 
  value: ..., // optional
};

// Call the `logTaskProgress()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await logTaskProgress(logTaskProgressVars);
// Variables can be defined inline as well.
const { data } = await logTaskProgress({ taskId: ..., date: ..., status: ..., value: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await logTaskProgress(dataConnect, logTaskProgressVars);

console.log(data.taskProgress_insert);

// Or, you can use the `Promise` API.
logTaskProgress(logTaskProgressVars).then((response) => {
  const data = response.data;
  console.log(data.taskProgress_insert);
});
```

### Using `LogTaskProgress`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, logTaskProgressRef, LogTaskProgressVariables } from '@dataconnect/generated';

// The `LogTaskProgress` mutation requires an argument of type `LogTaskProgressVariables`:
const logTaskProgressVars: LogTaskProgressVariables = {
  taskId: ..., 
  date: ..., 
  status: ..., 
  value: ..., // optional
};

// Call the `logTaskProgressRef()` function to get a reference to the mutation.
const ref = logTaskProgressRef(logTaskProgressVars);
// Variables can be defined inline as well.
const ref = logTaskProgressRef({ taskId: ..., date: ..., status: ..., value: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = logTaskProgressRef(dataConnect, logTaskProgressVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.taskProgress_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.taskProgress_insert);
});
```

