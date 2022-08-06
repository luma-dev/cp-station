import type { QueryRouteClientData, SubscriptionRouteClientData } from '@swingride/core';

type CancelSubscription = () => void;

export type PostpathClientQuery = <Params, Return>(
  queryRouteClientData: QueryRouteClientData<Params, Return>,
) => void extends Params
  ? (signal?: AbortSignal) => Promise<Return>
  : (params: Params, signal?: AbortSignal) => Promise<Return>;
export type PostpathClientSubscribe = <Params, Yield, Return>(
  params: {
    subscription: SubscriptionRouteClientData<Params, Yield, Return>;
    handleMessage: (message: Yield) => void;
    handleReturn: (returnValue: Return) => void;
  } & (void extends Params ? unknown : { params: Params }),
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
  const query = (query: QueryRouteClientData<any, any>) => async (arg0: any, arg1: any) => {
    const [signal, params]: [AbortSignal, any] = (query.isParamsVoid ? [arg0] : [arg1, arg0]) as any;
    if (httpBasePath == null) throw new Error('HTTP base path not configured');
    if (debug?.delayBeforeSendMs) {
      await delay(debug.delayBeforeSendMs);
      if (signal?.aborted) throw new Error('Aborted');
    }
    try {
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
      );
      if (!res.ok) throw new Error(await res.text());
      if (signal?.aborted) throw new Error('Aborted after fetch success');
      if (query.isReturnVoid) return;
      return (await res.json()) as any;
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      if (debug?.printErrorInConsole) console.error(e);
      throw e;
    }
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
        // eslint-disable-next-line no-console
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
