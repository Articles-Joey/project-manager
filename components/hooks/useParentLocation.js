import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useParentLocation() {
  const { data, error, isLoading } = useSWR('/api/parent-location', fetcher);

  return {
    path: data?.path,
    isLoading,
    isError: error,
  };
}
