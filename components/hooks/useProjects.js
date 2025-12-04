import useSWR from 'swr';
import { useStore } from './useStore';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useProjects(rootPath = 'F:\\My Documents\\Sites') {

  const additionalFolderLocations = useStore.getState().additionalFolderLocations || [];

  const { data, error, isLoading, mutate } = useSWR(
    `/api/projects?path=${encodeURIComponent(rootPath)}&additionalFolderLocations=${encodeURIComponent(JSON.stringify(additionalFolderLocations))}`,
    fetcher
  );

  return {
    packages: data?.projects || [],
    isLoading,
    isError: error,
    mutate,
  };
}