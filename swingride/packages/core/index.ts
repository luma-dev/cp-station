import type { z } from 'zod';

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

export type QueryRouteResolveParams<ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType> = {
  readonly paramsSchema: ParamsSchema;
  readonly returnSchema: ReturnScheme;
  readonly params: z.infer<ParamsSchema>;
  readonly metadata: Metadata;
};

export type QueryRoute<ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType> = {
  readonly paramsSchema: ParamsSchema;
  readonly returnSchema: ReturnScheme;
  readonly resolve: (
    params: QueryRouteResolveParams<ParamsSchema, ReturnScheme>,
  ) => z.infer<ReturnScheme> | Promise<z.infer<ReturnScheme>>;
};
export const createQueryRoute = <ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType>(
  params: QueryRoute<ParamsSchema, ReturnScheme>,
): QueryRoute<ParamsSchema, ReturnScheme> => params;

export type SubscriptionRouteSubscribeParams<
  ParamsSchema extends z.ZodType,
  YieldScheme extends z.ZodType,
  ReturnScheme extends z.ZodType,
> = {
  readonly paramsSchema: ParamsSchema;
  readonly yieldSchema: YieldScheme;
  readonly returnSchema: ReturnScheme;
  readonly params: z.infer<ParamsSchema>;
  readonly metadata: Metadata;
};
export type SubscriptionRouteHandleEventsParams<
  ParamsSchema extends z.ZodType,
  YieldScheme extends z.ZodType,
  ReturnScheme extends z.ZodType,
> = {
  readonly paramsSchema: ParamsSchema;
  readonly yieldSchema: YieldScheme;
  readonly returnSchema: ReturnScheme;
  readonly event: SubscriptionEvent;
  readonly metadata: Metadata;
};

export type SubscriptionEvent = {};
export type SubscriptionRoute<
  ParamsSchema extends z.ZodType,
  YieldScheme extends z.ZodType,
  ReturnScheme extends z.ZodType,
> = {
  readonly paramsSchema: ParamsSchema;
  readonly yieldSchema: YieldScheme;
  readonly returnSchema: ReturnScheme;
  readonly subscribe: (
    params: SubscriptionRouteSubscribeParams<ParamsSchema, YieldScheme, ReturnScheme>,
  ) =>
    | Iterator<z.infer<ReturnScheme>, z.infer<ReturnScheme>>
    | AsyncIterator<z.infer<ReturnScheme>, z.infer<ReturnScheme>>
    | Promise<Iterator<z.infer<ReturnScheme>, z.infer<ReturnScheme>>>
    | Promise<AsyncIterator<z.infer<ReturnScheme>, z.infer<ReturnScheme>>>;
  readonly handleEvents: (
    params: SubscriptionRouteHandleEventsParams<ParamsSchema, YieldScheme, ReturnScheme>,
  ) => void | Promise<void>;
};
export const createRouteSubscription = <
  ParamsSchema extends z.ZodType,
  YieldScheme extends z.ZodType,
  ReturnScheme extends z.ZodType,
>(
  params: SubscriptionRoute<ParamsSchema, YieldScheme, ReturnScheme>,
): SubscriptionRoute<ParamsSchema, YieldScheme, ReturnScheme> => params;

export type SubrouteRouters = Readonly<Record<string, Router>>;
export type Router = {
  readonly query?: QueryRoute<any, any>;
  readonly subscription?: SubscriptionRoute<any, any, any>;
  readonly subs?: SubrouteRouters;
};
export const createRouter = (router: Router): Router => router;

export type ResolveParams<ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType> = {
  query: QueryRoute<ParamsSchema, ReturnScheme>;
  params: z.infer<ParamsSchema>;
  metadata: unknown;
};
export const resolve = async <ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType>(
  params: ResolveParams<ParamsSchema, ReturnScheme>,
): Promise<z.infer<ReturnScheme>> => {
  return await params.query.resolve({
    paramsSchema: params.query.paramsSchema,
    returnSchema: params.query.returnSchema,
    params: params.params,
    metadata: params.metadata as any,
  });
};

export type MatchRouterParams = {
  router: Router;
  segments: string[];
};
export const matchRouter = (params: MatchRouterParams): Router | null => {
  let cur = params.router;
  for (const segment of params.segments) {
    if ('subs' in cur && Object.prototype.hasOwnProperty.call(cur.subs, segment)) {
      cur = cur.subs![segment];
    } else {
      return null;
    }
  }
  return cur;
};

export const isQueryRouter = (router: Router): router is Router & Required<Pick<Router, 'query'>> => {
  return 'query' in router && Boolean(router.query);
};

export const isSubscriptionRouter = (router: Router): router is Router & Required<Pick<Router, 'subscription'>> => {
  return 'subscription' in router && Boolean(router.subscription);
};

export const hasSubroutes = (router: Router): router is Router & Required<Pick<Router, 'subs'>> => {
  return 'subs' in router && Boolean(router.subs) && Object.keys(router.subs as any).length > 0;
};

export type QueryRouteClientData<Params, Return> = {
  segments: string[];
  isParamsVoid: boolean;
  isReturnVoid: boolean;
  [s: symbol]: {
    params: Params;
    returnValue: Return;
  };
};
export type ParamsOfQuery<T extends QueryRouteClientData<any, any>> = T extends QueryRouteClientData<infer Params, any>
  ? Params
  : never;
export type ReturnOfQuery<T extends QueryRouteClientData<any, any>> = T extends QueryRouteClientData<any, infer Return>
  ? Return
  : never;

export type SubscriptionRouteClientData<Params, Yield, Return> = {
  segments: string[];
  isParamsVoid: boolean;
  isYieldVoid: boolean;
  isReturnVoid: boolean;
  [s: symbol]: {
    params: Params;
    yieldValue: Yield;
    returnValue: Return;
  };
};
