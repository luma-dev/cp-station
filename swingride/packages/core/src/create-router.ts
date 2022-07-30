import type { ImplRouter } from './impl-router';

// export type QueryRoute<ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType> = {
//   readonly paramsSchema: ParamsSchema;
//   readonly returnSchema: ReturnScheme;
// };
// export const createQueryRoute = <ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType>(
//   params: QueryRoute<ParamsSchema, ReturnScheme>,
// ): QueryRoute<ParamsSchema, ReturnScheme> => params;
//
// export type SubscriptionRoute<
//   ParamsSchema extends z.ZodType,
//   YieldScheme extends z.ZodType,
//   ReturnScheme extends z.ZodType,
// > = {
//   readonly paramsSchema: ParamsSchema;
//   readonly yieldSchema: YieldScheme;
//   readonly returnSchema: ReturnScheme;
// };
// export const createRouteSubscription = <
//   ParamsSchema extends z.ZodType,
//   YieldScheme extends z.ZodType,
//   ReturnScheme extends z.ZodType,
// >(
//   params: SubscriptionRoute<ParamsSchema, YieldScheme, ReturnScheme>,
// ): SubscriptionRoute<ParamsSchema, YieldScheme, ReturnScheme> => params;
//
// export type SubRouters = Readonly<Record<string, Router>>;
// export type Router = {
//   readonly $query?: QueryRoute<any, any>;
//   readonly $subscription?: SubscriptionRoute<any, any, any>;
//   readonly $?: SubRouters;
// };
// export const createRouter = (router: Router): Router => router;

export type MatchRouterParams = {
  router: ImplRouter;
  segments: string[];
};
export const matchRouter = (params: MatchRouterParams): ImplRouter | null => {
  let cur = params.router;
  for (const segment of params.segments) {
    if ('$' in cur && Object.prototype.hasOwnProperty.call(cur.$, segment)) {
      cur = cur.$![segment];
    } else {
      return null;
    }
  }
  return cur;
};

export const isQueryRouter = (router: ImplRouter): router is ImplRouter & Required<Pick<ImplRouter, '$query'>> => {
  return '$query' in router && Boolean(router.$query);
};

export const isSubscriptionRouter = (
  router: ImplRouter,
): router is ImplRouter & Required<Pick<ImplRouter, '$subscription'>> => {
  return 'subscription' in router && Boolean(router.$subscription);
};

export const hasSubroutes = (router: ImplRouter): router is ImplRouter & Required<Pick<ImplRouter, '$'>> => {
  return '$' in router && Boolean(router.$) && Object.keys(router.$ as any).length > 0;
};

export type ParamsOfQuery<T extends QueryRouteServerData<any, any>> = T extends QueryRouteServerData<infer Params, any>
  ? Params
  : never;
export type ReturnOfQuery<T extends QueryRouteServerData<any, any>> = T extends QueryRouteServerData<any, infer Return>
  ? Return
  : never;

export type QueryRouteServerData<Params, Return> = {
  segments: string[];
  isParamsVoid: boolean;
  isReturnVoid: boolean;
  [s: symbol]: {
    params: Params;
    returnValue: Return;
  };
};
export type SubscriptionRouteServerData<Params, Yield, Return> = {
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
