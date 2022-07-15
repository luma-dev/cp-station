import type { QueryRouteClientData, SubscriptionRouteClientData } from '@swingride/core';

type CancelSubscription = () => void;

export type PostpathClientQueryParams<Params, Return> = {
  query: QueryRouteClientData<Params, Return>;
  signal?: AbortSignal;
} & (Params extends void ? unknown : { params: Params });
export type PostpathClientQuery = <Params, Return>(
  params: PostpathClientQueryParams<Params, Return>,
) => Promise<Return>;
export type PostpathClientSubscribe = <Params, Yield, Return>(
  params: {
    subscription: SubscriptionRouteClientData<Params, Yield, Return>;
    handleMessage: (message: Yield) => void;
    handleReturn: (returnValue: Return) => void;
  } & (Params extends void ? unknown : { params: Params }),
) => CancelSubscription;
export type PostpathClient = {
  query: PostpathClientQuery;
  subscribe: PostpathClientSubscribe;
};

const delay = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export type CreatePostpathClientParams = {
  httpBasePath?: string | undefined;
  wsBasePath?: string | undefined;
  debug?: {
    delayBeforeSendMs?: number;
    printErrorInConsole?: boolean;
  };
};
export const createPostpathClient = ({
  wsBasePath,
  httpBasePath,
  debug,
}: CreatePostpathClientParams): PostpathClient => {
  const query = async ({
    query,
    params,
    signal,
  }: Omit<PostpathClientQueryParams<any, any>, 'params'> & { params: any }) => {
    if (httpBasePath == null) throw new Error('HTTP base path not configured');
    if (debug?.delayBeforeSendMs) {
      await delay(debug.delayBeforeSendMs);
      if (signal?.aborted) throw new Error('Aborted');
    }
    const res = await fetch(
      `${httpBasePath}/${query.segments.map((segment: string) => encodeURIComponent(segment)).join('/')}`,
      {
        method: 'post',
        ...(query.isParamsVoid
          ? {}
          : {
              body: JSON.stringify(params),
              headers: {
                'Content-Type': 'application/json',
              },
            }),
        signal,
      },
    ).catch((e) => {
      // eslint-disable-next-line no-console
      if (debug?.printErrorInConsole) console.error(e);
      throw e;
    });
    if (signal?.aborted) throw new Error('Aborted after fetch success');
    if (query.isReturnVoid) return;
    return (await res.json()) as any;
  };
  return {
    query: query as any,
    subscribe: ({ subscription, params, handleMessage, handleReturn }: any) => {
      if (wsBasePath == null) throw new Error('WebSocket base path not configured');

      const socket = new WebSocket(
        `${wsBasePath}/${subscription.segments.map((segment: string) => encodeURIComponent(segment)).join('/')}`,
      );

      socket.addEventListener('open', (_event) => {
        socket.send(JSON.stringify(params));
      });

      socket.addEventListener('message', (event) => {
        console.log('Message from server ', event.data);
        void handleMessage;
        void handleReturn;
      });

      return () => {
        socket.close();
      };
    },
  };
};
