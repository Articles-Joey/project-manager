import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useOsUsername() {
    const { data, error, isLoading } = useSWR(
        `/api/get-username`,
        fetcher
    );

    return {
        username: data?.username || '',
        isLoading,
        isError: error,
    };
}