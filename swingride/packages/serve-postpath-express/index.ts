import type { Router } from '@swingride/core';
import { isQueryRouter, isSubscriptionRouter, matchRouter, resolve, withContextAny } from '@swingride/core';
import { parseUrlAsPostpath } from '@swingride/util-postpath';
import type { RequestHandler } from 'express';
import type { IncomingMessage, Server as HTTPServer } from 'node:http';
import type { Server as HTTPSServer } from 'node:https';
import * as WebSocket from 'ws';

const isZodVoid = (zod: any) => {
  return zod._def.typeName === 'ZodVoid';
};

export type ShouldHandleUpgradeParams = {
  router: Router;
  request: IncomingMessage;
  pathPrefix?: string | undefined;
};
export const shouldHandleUpgrade = (params: ShouldHandleUpgradeParams) => {
  const segments = parseUrlAsPostpath({ url: params.request.url, pathPrefix: params.pathPrefix });
  if (!segments) return false;
  const found = matchRouter({ router: params.router, segments });
  if (!found || !isSubscriptionRouter(found)) return false;
  return true;
};

export type ExpressMiddlewareParams = {
  router: Router;
  context?: unknown;
  getBodyJson?: (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) => unknown;
};
export const constructExpressMiddlewareByRouter = ({
  router,
  context,
  getBodyJson = (req) => req.body,
}: ExpressMiddlewareParams): RequestHandler => {
  return (req, res, next) => {
    if (req.method === 'POST') {
      const segments = req.path === '' ? [] : req.path.slice(1).split('/');
      let encodedSegments: string[];
      try {
        encodedSegments = segments.map((segment) => encodeURIComponent(segment));
      } catch {
        next();
        return;
      }
      const found = matchRouter({ router, segments: encodedSegments });
      if (!found) {
        next();
        return;
      }
      if (isQueryRouter(found)) {
        const params = isZodVoid(found.query.paramsSchema)
          ? undefined
          : found.query.paramsSchema.parse(getBodyJson(req, res));

        const contextKey = Symbol('Context Key');
        withContextAny({
          key: contextKey,
          context,
          async fn() {
            const returnValue = await resolve({
              query: found.query,
              params,
              metadata: contextKey,
            });
            const json = JSON.stringify(returnValue);
            res.status(200).send(json);
          },
        }).catch((e) => {
          res.status(500).send(e);
        });
        return;
      }
    }
    next();
  };
};

export type ConstructNoServerWebSocketServer = {
  router: Router;
  server?: HTTPServer | HTTPSServer | undefined;
  pathPrefix?: string | undefined;
};
export const constructNoServerWebSocketServer = ({ router, pathPrefix, server }: ConstructNoServerWebSocketServer) => {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws) => {
    const segments = parseUrlAsPostpath({ url: ws.url, pathPrefix });
    if (!segments) {
      ws.close();
      return;
    }
    const found = matchRouter({ router, segments });
    if (!found || !isSubscriptionRouter(found)) {
      ws.close();
      return;
    }
    wss.on('message', (message) => {
      console.log('_x_[XXX]_x_ ffffffffff');
      console.log({ message });
    });
  });
  return wss;
};
