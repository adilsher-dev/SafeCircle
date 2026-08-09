import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/api/client';

interface UseAsyncOptions {
  successMessage?: string;
  showErrorToast?: boolean;
}

/**
 * Wraps an async action with loading / error state and optional toast feedback.
 * Usage: const { run, loading, error } = useAsyncAction();
 *        await run(() => someApi.call(payload), { successMessage: 'Saved!' })
 */
export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T,>(fn: () => Promise<T>, options?: UseAsyncOptions): Promise<T | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (options?.successMessage) toast.success(options.successMessage);
      return result;
    } catch (err) {
      const message = extractErrorMessage(err);
      setError(message);
      if (options?.showErrorToast !== false) toast.error(message);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  return { run, loading, error, setError };
}

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Simple one-shot fetch-on-mount hook with refetch */
export function useFetchOnMount<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<UseFetchState<T>>({ data: null, loading: true, error: null });

  const refetch = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => setState({ data: null, loading: false, error: extractErrorMessage(err) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return { ...state, refetch, setState };
}
