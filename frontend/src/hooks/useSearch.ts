import { useQuery } from '@tanstack/react-query';
import { searchTrains } from '../services/api/train';
import { useDebounce } from './useDebounce';
import { DEBOUNCE_DELAY_MS } from '../constants/config';

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY_MS);

  return useQuery({
    queryKey: ['trainSearch', debouncedQuery],
    queryFn: () => searchTrains(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
