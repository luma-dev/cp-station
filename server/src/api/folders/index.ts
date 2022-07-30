import { folderDataSchema } from '@cp-station/core';
import { implQueryRoute, implRouter } from '@swingride/core';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { getContext } from '../context';

const list = implRouter({
  $query: implQueryRoute({
    paramsSchema: z.void(),
    returnSchema: z.array(
      z.object({
        dirname: z.string(),
        data: folderDataSchema,
      }),
    ),
    async resolve({ metadata }) {
      const { workdir } = getContext(metadata);
      const dir = await fs.promises.readdir(workdir, { encoding: 'utf8', withFileTypes: true });
      return (
        await Promise.all(
          dir
            .filter((e) => e.isDirectory)
            .map(async (e) => {
              const data = folderDataSchema.parse(
                JSON.parse(
                  await fs.promises.readFile(path.resolve(workdir, e.name, 'cp-station.data.json'), {
                    encoding: 'utf8',
                  }),
                ),
              );
              return [
                {
                  dirname: e.name,
                  data,
                },
              ];
            })
            .map((e) =>
              e.catch((e) => {
                // eslint-disable-next-line no-console
                console.error(e);
                return [];
              }),
            ),
        )
      ).flat();
    },
  }),
});

export default implRouter({
  $: {
    list,
  },
});
