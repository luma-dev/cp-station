import { useCallback, useEffect, useRef, useState } from 'react';

export type UseAsyncState = 'initial' | 'aborted' | 'fetching' | 'success' | 'error';
export type UseAsyncParams<Value> = {
  fn: (signal: AbortSignal) => Value | Promise<Value>;
  onSuccess?: (value: Value) => void;
  onError?: (error: unknown) => void;
};
export type UseAsyncResult<Value> = {
  state: UseAsyncState;
  /**
   * Last successful data. Data will not be reset even if following runs were failed or aborted.
   */
  data: Value | undefined;
  error: unknown;
  run: () => Promise<Value>;
  abort: () => void;
};
export const useAsync = <Value>(
  { fn, onSuccess, onError }: UseAsyncParams<Value>,
  runDeps?: unknown[],
): UseAsyncResult<Value> => {
  const [state, setState] = useState<UseAsyncState>('initial');
  const [data, setData] = useState<Value | undefined>(undefined);
  const [error, setError] = useState<unknown>(undefined);
  const [controller, setController] = useState<AbortController | null>(null);
  const run = useCallback(async () => {
    // transition to "fetching"
    setState('fetching');
    setError(undefined);
    if (controller != null && state === 'fetching') {
      controller.abort();
    }

    const newController = new AbortController();
    setController(newController);

    let abortedThisCall = false;
    const abortHandler = () => {
      newController.signal.removeEventListener('abort', abortHandler);
      abortedThisCall = true;
    };
    newController.signal.addEventListener('abort', abortHandler);

    try {
      const value = await Promise.resolve((fn as any)(newController.signal));
      // transition to "success"
      setState('success');
      onSuccess?.(value);
      setData(value);
      newController.signal.removeEventListener('abort', abortHandler);
      return value;
    } catch (e: unknown) {
      if (abortedThisCall) return;
      // transition to "error"
      setState('error');
      onError?.(e);
      setError(e);
      newController.signal.removeEventListener('abort', abortHandler);
    }
  }, [controller, fn, onError, onSuccess, state]);
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  }, [run]);

  const abort = useCallback(() => {
    // transition to "aborted"
    setState('aborted');
    setError(undefined);
    if (controller != null && state === 'fetching') {
      controller.abort();
    }
  }, [controller, state]);

  /* eslint-disable react-hooks/exhaustive-deps */
  // auto run
  useEffect(() => {
    if (runDeps != null) {
      void runRef.current();
    }
  }, [runDeps != null, ...(runDeps ?? [])]);
  /* eslint-enable react-hooks/exhaustive-deps */
  return { state, run: run as any, abort, data, error };
};
