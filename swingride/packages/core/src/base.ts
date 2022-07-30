declare const metadataSymbolNominal: unique symbol;
export type Metadata = typeof metadataSymbolNominal;

export type WithContextParams<Context> = {
  key: unknown;
  context: Context;
  fn: () => void | Promise<void>;
};
export type CreateContextReturn<Context> = {
  getContext: (metadata: Metadata) => Context;
  withContext: (params: WithContextParams<Context>) => Promise<void>;
};

export const globalContextMap = new Map<unknown, unknown>();
export const createContext = <Context>(): CreateContextReturn<Context> => {
  return {
    getContext(metadata) {
      const key = metadata as any;
      return globalContextMap.get(key) as any;
    },
    withContext: withContextAny,
  };
};

export const withContextAny = async ({ key, context, fn }: WithContextParams<any>) => {
  const had = globalContextMap.has(key);
  const old = globalContextMap.get(key);
  globalContextMap.set(key, context);
  try {
    await fn();
  } finally {
    if (had) {
      globalContextMap.set(key, old);
    } else {
      globalContextMap.delete(key);
    }
  }
};
