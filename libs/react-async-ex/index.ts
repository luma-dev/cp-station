import type { UseAsyncParams, UseAsyncResult } from '@lumastack/react-async';
import { useAsync } from '@lumastack/react-async';
import { useEffect, useRef, useState } from 'react';

export const useAsyncExParamsDefault = {
  retryOnError: true,
  retryOnErrorMaxCount: 3,
  retryOnErrorDeferMs: 5000,
} as const;
export type UseAsyncExParams<Value> = UseAsyncParams<Value> & {
  retryOnError?: boolean;
  retryOnErrorMaxCount?: number;
  retryOnErrorDeferMs?: number;
};
export type UseAsyncExResult<Value> = UseAsyncResult<Value>;
export const useAsyncEx = <Value>(params: UseAsyncExParams<Value>, runDeps?: unknown[]): UseAsyncExResult<Value> => {
  const {
    retryOnError = useAsyncExParamsDefault.retryOnError,
    retryOnErrorMaxCount = useAsyncExParamsDefault.retryOnErrorMaxCount,
    retryOnErrorDeferMs = useAsyncExParamsDefault.retryOnErrorDeferMs,
    ...restParams
  } = params;

  const [retryOnErrorCount, setRetryOnErrorCount] = useState(0);
  const retryOnErrorCountRef = useRef(0);
  const result = useAsync(restParams, runDeps);
  const resultRef = useRef(result);
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (result.state === 'success' || result.state === 'aborted') {
      retryOnErrorCountRef.current = 0;
      setRetryOnErrorCount(0);
    }
  }, [result.state === 'success' || result.state === 'aborted']);
  useEffect(() => {
    if (retryOnError && result.state === 'error' && retryOnErrorCount < retryOnErrorMaxCount) {
      let lastId: NodeJS.Timeout;
      const queueTimeout = () => {
        lastId = setTimeout(() => {
          retryOnErrorCountRef.current += 1;
          setRetryOnErrorCount(retryOnErrorCountRef.current);
          resultRef.current.run();
          if (retryOnErrorCountRef.current < retryOnErrorMaxCount) queueTimeout();
        }, retryOnErrorDeferMs);
      };
      queueTimeout();
      return () => {
        clearTimeout(lastId);
      };
    }
  }, [retryOnError && result.state === 'error' && retryOnErrorCount < retryOnErrorMaxCount]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return { ...result, retryOnErrorCount } as any;
};
