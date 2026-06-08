import { ListTasksForUserData, CreateTaskData, CreateTaskVariables, LogTaskProgressData, LogTaskProgressVariables, GetRecentProgressData, GetRecentProgressVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useListTasksForUser(options?: useDataConnectQueryOptions<ListTasksForUserData>): UseDataConnectQueryResult<ListTasksForUserData, undefined>;
export function useListTasksForUser(dc: DataConnect, options?: useDataConnectQueryOptions<ListTasksForUserData>): UseDataConnectQueryResult<ListTasksForUserData, undefined>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useLogTaskProgress(options?: useDataConnectMutationOptions<LogTaskProgressData, FirebaseError, LogTaskProgressVariables>): UseDataConnectMutationResult<LogTaskProgressData, LogTaskProgressVariables>;
export function useLogTaskProgress(dc: DataConnect, options?: useDataConnectMutationOptions<LogTaskProgressData, FirebaseError, LogTaskProgressVariables>): UseDataConnectMutationResult<LogTaskProgressData, LogTaskProgressVariables>;

export function useGetRecentProgress(vars: GetRecentProgressVariables, options?: useDataConnectQueryOptions<GetRecentProgressData>): UseDataConnectQueryResult<GetRecentProgressData, GetRecentProgressVariables>;
export function useGetRecentProgress(dc: DataConnect, vars: GetRecentProgressVariables, options?: useDataConnectQueryOptions<GetRecentProgressData>): UseDataConnectQueryResult<GetRecentProgressData, GetRecentProgressVariables>;
