import { generateRoutesCode } from '@swingride/codegen-routes';
import {
  constructExpressMiddlewareByRouter,
  constructNoServerWebSocketServer,
} from '@swingride/serve-psotpath-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'node:http';
import * as path from 'node:path';
import router from '../api';

/* eslint-disable no-console */
async function main() {
  console.log('[INFO] Development script started.');
  generateRoutesCode({
    router,
    outputPath: path.resolve(__dirname, '../../../libs/routes-gen/routes.gen.ts'),
  });

  const app = express();
  app.use(bodyParser.json({ strict: false }));
  app.use(
    cors({
      origin: true,
    }),
  );
  const server = createServer(app);
  constructNoServerWebSocketServer({ router, server });

  // const routerWss = constructNoServerWebSocketServer({ router });

  // server.on('upgrade', (request, socket, head) => {
  //   if (
  //     shouldHandleUpgrade({
  //       router,
  //       request,
  //     })
  //   ) {
  //     routerWss.handleUpgrade(request, socket, head, (ws) => {
  //       routerWss.emit('connection', ws, request);
  //     });
  //   } else {
  //     socket.destroy();
  //   }
  // });

  app.use(
    constructExpressMiddlewareByRouter({
      router,
    }),
  );

  await new Promise<void>((resolve) => {
    app.listen(Number.parseInt(process.env.PORT || '8052', 10), '::', resolve);
  });

  console.log('🚀 Server ready at http://localhost:8052');
}
/* eslint-enable no-console */

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
