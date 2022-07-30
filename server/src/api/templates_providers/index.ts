import type { FolderData } from '@cp-station/core';
import { templateProviderConfigFileSchema, templateProviderSchema } from '@cp-station/core';
import { templateCaller } from '@cp-station/template-spec';
import { validateResultSchema } from '@cp-station/template-spec/template-caller/common';
import { implQueryRoute, implRouter } from '@swingride/core';
import cuid from 'cuid';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';
import { getContext } from '../context';

const configDir = path.resolve(os.homedir(), '.config/cp-station');
const jsonPath = path.resolve(configDir, 'template-providers.json');

const set = implRouter({
  $query: implQueryRoute({
    paramsSchema: templateProviderConfigFileSchema,
    returnSchema: z.void(),
    async resolve({ params: config }) {
      const json = JSON.stringify(config);
      await fs.promises.mkdir(configDir, { recursive: true });
      await fs.promises.writeFile(jsonPath, json);
    },
  }),
});

const get = implRouter({
  $query: implQueryRoute({
    paramsSchema: z.void(),
    returnSchema: templateProviderConfigFileSchema,
    async resolve() {
      const config = await (async () => {
        try {
          return templateProviderConfigFileSchema.parse(JSON.parse((await fs.promises.readFile(jsonPath)).toString()));
        } catch {
          return [];
        }
      })();
      return config;
    },
  }),
});

const listInstances = implRouter({
  $query: implQueryRoute({
    paramsSchema: templateProviderSchema,
    returnSchema: z.union([z.null(), z.array(z.string())]),
    async resolve({ params }) {
      const caller = await templateCaller.createLocalTemplateCaller({ provider: params });
      return await caller.listInstances();
    },
  }),
});

const validate = implRouter({
  $query: implQueryRoute({
    paramsSchema: templateProviderSchema,
    returnSchema: validateResultSchema,
    async resolve({ params }) {
      const caller = await templateCaller.createLocalTemplateCaller({ provider: params });
      return await caller.validate();
    },
  }),
});

const getDefaultInstance = implRouter({
  $query: implQueryRoute({
    paramsSchema: templateProviderSchema,
    returnSchema: z.string(),
    async resolve({ params }) {
      const caller = await templateCaller.createLocalTemplateCaller({ provider: params });
      return await caller.getDefaultInstance();
    },
  }),
});

const setup = implRouter({
  $query: implQueryRoute({
    paramsSchema: z.object({
      templateProvider: templateProviderSchema,
      instance: z.string(),
    }),
    returnSchema: z.void(),
    async resolve({ params, metadata }) {
      const { workdir } = getContext(metadata);
      const caller = await templateCaller.createLocalTemplateCaller({ provider: params.templateProvider });
      const to = path.resolve(workdir, cuid());
      await caller.copyFromInstance({
        instance: params.instance,
        absPathCopyTo: to,
      });
      const cpTemplateDataPath = path.resolve(to, 'cp-station.data.json');
      const folderData: FolderData = {
        templateProvider: params.templateProvider,
      };
      await fs.promises.writeFile(cpTemplateDataPath, JSON.stringify(folderData));
    },
  }),
});

export default implRouter({
  $: {
    get,
    set,
    validate,
    listInstances,
    getDefaultInstance,
    setup,
  },
});
