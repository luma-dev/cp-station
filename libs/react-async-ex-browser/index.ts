import type { UseAsyncExParams, UseAsyncExResult } from '@lumastack/react-async-ex';
import { useAsyncEx } from '@lumastack/react-async-ex';
import { useEffect, useRef } from 'react';

export const useAsyncExBrowserParamsDefault = {
  rerunOnBlur: true,
} as const;
export type UseAsyncExBrowserParams<Value> = UseAsyncExParams<Value> & {
  rerunOnBlur?: boolean;
};
export type UseAsyncExBrowserResult<Value> = UseAsyncExResult<Value>;
export const useAsyncExBrowser = <Value>(
  params: UseAsyncExBrowserParams<Value>,
  runDeps?: unknown[],
): UseAsyncExBrowserResult<Value> => {
  const { rerunOnBlur = useAsyncExBrowserParamsDefault.rerunOnBlur, ...restParams } = params;

  const result = useAsyncEx(restParams, runDeps);
  const resultRef = useRef(result);
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (rerunOnBlur && runDeps != null) {
      const blurHandler = () => {
        resultRef.current.run();
      };
      window.addEventListener('focus', blurHandler);
      return () => {
        window.removeEventListener('focus', blurHandler);
      };
    }
  }, [rerunOnBlur && runDeps != null]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return result;
};
