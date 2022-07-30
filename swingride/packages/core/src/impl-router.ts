import type { z } from 'zod';
import type { Metadata } from './base';

export type QueryRouteResolveParams<ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType> = {
  readonly segments: string[];
  readonly paramsSchema: ParamsSchema;
  readonly returnSchema: ReturnScheme;
  readonly params: z.infer<ParamsSchema>;
  readonly metadata: Metadata;
};

export type QueryRouteImpl<ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType> = {
  readonly paramsSchema: ParamsSchema;
  readonly returnSchema: ReturnScheme;
  readonly resolve: (
    params: QueryRouteResolveParams<ParamsSchema, ReturnScheme>,
  ) => z.infer<ReturnScheme> | Promise<z.infer<ReturnScheme>>;
};
export const implQueryRoute = <ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType>(
  params: QueryRouteImpl<ParamsSchema, ReturnScheme>,
): QueryRouteImpl<ParamsSchema, ReturnScheme> => params;

export type SubscriptionRouteSubscribeParams<
  ParamsSchema extends z.ZodType,
  YieldScheme extends z.ZodType,
  ReturnScheme extends z.ZodType,
> = {
  readonly segments: string[];
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
export type SubscriptionRouteImpl<
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
    | Iterator<z.infer<YieldScheme>, z.infer<ReturnScheme>>
    | AsyncIterator<z.infer<YieldScheme>, z.infer<ReturnScheme>>
    | Promise<Iterator<z.infer<YieldScheme>, z.infer<ReturnScheme>>>
    | Promise<AsyncIterator<z.infer<YieldScheme>, z.infer<ReturnScheme>>>;
  // readonly handleEvents: (
  //   params: SubscriptionRouteHandleEventsParams<ParamsSchema, YieldScheme, ReturnScheme>,
  // ) => void | Promise<void>;
};
export const implRouteSubscription = <
  ParamsSchema extends z.ZodType,
  YieldScheme extends z.ZodType,
  ReturnScheme extends z.ZodType,
>(
  params: SubscriptionRouteImpl<ParamsSchema, YieldScheme, ReturnScheme>,
): SubscriptionRouteImpl<ParamsSchema, YieldScheme, ReturnScheme> => params;

export type SubImplRouters = Readonly<Record<string, ImplRouter>>;
export type ImplRouter = {
  readonly $query?: QueryRouteImpl<any, any>;
  readonly $subscription?: SubscriptionRouteImpl<any, any, any>;
  readonly $?: SubImplRouters;
};
export const implRouter = (router: ImplRouter): ImplRouter => router;

export type ResolveParams<ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType> = {
  segments: string[];
  query: QueryRouteImpl<ParamsSchema, ReturnScheme>;
  params: z.infer<ParamsSchema>;
  metadata: unknown;
};
export const resolve = async <ParamsSchema extends z.ZodType, ReturnScheme extends z.ZodType>(
  params: ResolveParams<ParamsSchema, ReturnScheme>,
): Promise<z.infer<ReturnScheme>> => {
  return await params.query.resolve({
    segments: params.segments,
    paramsSchema: params.query.paramsSchema,
    returnSchema: params.query.returnSchema,
    params: params.params,
    metadata: params.metadata as any,
  });
};
