import { folderEntrySchema, folderSpecifierSchema } from '@cp-station/core';
import { implQueryRoute, implRouter } from '@swingride/core';
import { z } from 'zod';
import { getContext } from '../context';

const list = implRouter({
  $query: implQueryRoute({
    paramsSchema: z.void(),
    returnSchema: z.array(folderEntrySchema),
    async resolve({ metadata }) {
      const {
        folder: { listFolders },
      } = getContext(metadata);
      return await listFolders();
    },
  }),
});

const getById = implRouter({
  $query: implQueryRoute({
    paramsSchema: folderSpecifierSchema,
    returnSchema: folderEntrySchema.nullable(),
    async resolve({ metadata, params: folderSpecifier }) {
      const {
        folder: { getFolder },
      } = getContext(metadata);
      return (await getFolder(folderSpecifier)) ?? null;
    },
  }),
});

const getBundledCode = implRouter({
  $query: implQueryRoute({
    paramsSchema: folderSpecifierSchema,
    returnSchema: z.string(),
    async resolve({ metadata, params: folderSpecifier }) {
      const {
        folder: { getBundledCode },
      } = getContext(metadata);
      return await getBundledCode(folderSpecifier);
    },
  }),
});

const setFolderName = implRouter({
  $query: implQueryRoute({
    paramsSchema: z.object({
      folderSpecifier: folderSpecifierSchema,
      newFolderName: z.string(),
    }),
    returnSchema: z.void(),
    async resolve({ metadata, params }) {
      const {
        folder: { setFolderName },
      } = getContext(metadata);
      return await setFolderName(params);
    },
  }),
});

export default implRouter({
  $: {
    list,
    getById,
    getBundledCode,
    setFolderName,
  },
});
