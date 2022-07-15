import { templateProviderConfigSchema, templateProviderSchema } from '@cp-station/core';
import { createQueryRoute, createRouter } from '@swingride/core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { z } from 'zod';

const configDir = path.resolve(os.homedir(), '.config/cp-station');
const jsonPath = path.resolve(configDir, 'template-providers.json');

const isDir = async (p: string): Promise<boolean> => {
  try {
    const s = await fs.promises.stat(p);
    return s.isDirectory();
  } catch {
    return false;
  }
};

const isFile = async (p: string): Promise<boolean> => {
  try {
    await fs.promises.access(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
};

const isExecutable = async (p: string): Promise<boolean> => {
  try {
    await fs.promises.access(p, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
};

const isTemplateDirStructure = async (p: string): Promise<boolean> => {
  return (
    (await isDir(p)) &&
    (await isDir(path.resolve(p, 'instances'))) &&
    (await isExecutable(path.resolve(p, '.cp-template')))
  );
};

const checkIsDirectory = createRouter({
  $query: createQueryRoute({
    paramsSchema: z.string(),
    returnSchema: z.boolean(),
    async resolve({ params: p }) {
      return await isDir(p);
    },
  }),
});

const checkIsTemplateDirStructure = createRouter({
  $query: createQueryRoute({
    paramsSchema: z.string(),
    returnSchema: z.boolean(),
    async resolve({ params: p }) {
      return await isTemplateDirStructure(p);
    },
  }),
});

const set = createRouter({
  $query: createQueryRoute({
    paramsSchema: templateProviderConfigSchema,
    returnSchema: z.void(),
    async resolve({ params: config }) {
      const json = JSON.stringify(config);
      await fs.promises.mkdir(configDir, { recursive: true });
      await fs.promises.writeFile(jsonPath, json);
    },
  }),
});

const get = createRouter({
  $query: createQueryRoute({
    paramsSchema: z.void(),
    returnSchema: templateProviderConfigSchema,
    async resolve() {
      const config = await (async () => {
        try {
          return templateProviderConfigSchema.parse(JSON.parse((await fs.promises.readFile(jsonPath)).toString()));
        } catch {
          return [];
        }
      })();
      return config;
    },
  }),
});

const listInstances = createRouter({
  $query: createQueryRoute({
    paramsSchema: templateProviderSchema,
    returnSchema: z.union([z.null(), z.array(z.string())]),
    async resolve({ params }) {
      const p = params.path;
      if (!(await isTemplateDirStructure(p))) return null;
      const names = await fs.promises.readdir(path.resolve(p, 'instances'), { withFileTypes: true });
      return names.filter((n) => n.isDirectory).map((n) => n.name);
    },
  }),
});

const generate = createRouter({
  $query: createQueryRoute({
    paramsSchema: templateProviderSchema,
    returnSchema: z.void(),
    async resolve({ params }) {
      params.path;
    },
  }),
});

export default createRouter({
  $: {
    checkIsDirectory,
    checkIsTemplateDirStructure,
    get,
    set,

    listInstances,
    generate,
  },
});
