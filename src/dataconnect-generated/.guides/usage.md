# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useListTasksForUser, useCreateTask, useLogTaskProgress, useGetRecentProgress } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useListTasksForUser();

const { data, isPending, isSuccess, isError, error } = useCreateTask(createTaskVars);

const { data, isPending, isSuccess, isError, error } = useLogTaskProgress(logTaskProgressVars);

const { data, isPending, isSuccess, isError, error } = useGetRecentProgress(getRecentProgressVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listTasksForUser, createTask, logTaskProgress, getRecentProgress } from '@dataconnect/generated';


// Operation ListTasksForUser: 
const { data } = await ListTasksForUser(dataConnect);

// Operation CreateTask:  For variables, look at type CreateTaskVars in ../index.d.ts
const { data } = await CreateTask(dataConnect, createTaskVars);

// Operation LogTaskProgress:  For variables, look at type LogTaskProgressVars in ../index.d.ts
const { data } = await LogTaskProgress(dataConnect, logTaskProgressVars);

// Operation GetRecentProgress:  For variables, look at type GetRecentProgressVars in ../index.d.ts
const { data } = await GetRecentProgress(dataConnect, getRecentProgressVars);


```