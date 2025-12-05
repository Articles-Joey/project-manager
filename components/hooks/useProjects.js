import useSWR from 'swr';
import { useStore } from './useStore';
import { useParentLocation } from './useParentLocation';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useProjects(rootPath) {

  const additionalFolderLocations = useStore.getState().additionalFolderLocations || [];

  const { path: parentPath, isLoading: isParentLocationLoading } = useParentLocation();

  const effectiveRootPath = rootPath || parentPath;

  const { data, error, isLoading: isProjectsLoading, mutate } = useSWR(
    effectiveRootPath ? `/api/projects?path=${encodeURIComponent(effectiveRootPath)}&additionalFolderLocations=${encodeURIComponent(JSON.stringify(additionalFolderLocations))}` : null,
    fetcher
  );

  return {
    packages: data?.projects || [],
    isLoading: (!rootPath && isParentLocationLoading) || isProjectsLoading,
    isError: error,
    mutate,
  };
}