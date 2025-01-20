import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * Custom React hook for managing Appwrite API calls with state management and error handling
 * 
 * @template T - The expected return type of the API call
 * @template P - The parameters type for the API call, must be a record of strings/numbers
 * 
 * Features:
 * - Handles loading states automatically
 * - Provides error handling with user feedback via Alert
 * - Supports manual refetching with new parameters
 * - Allows skipping initial fetch
 * - Type-safe parameters and return values
 */
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams: P) => Promise<void>;
}

// Custom React hook for managing Appwrite API calls with state handling
export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn, // The asynchronous function to fetch data
  params = {} as P, // Default fetch parameters (empty object)
  skip = false, // Whether to skip the initial fetch
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function to prevent unnecessary rerenders
  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn(fetchParams);
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  // Execute initial fetch if not skipped
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []);

  // Allow manual refetching with new parameters
  const refetch = async (newParams: P) => await fetchData(newParams);

  return { data, loading, error, refetch };
};
