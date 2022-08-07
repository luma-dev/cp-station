import { caseDataEntriesSchema, folderSpecifierSchema } from '@cp-station/core';
import { implQueryRoute, implRouter } from '@swingride/core';
import { createCaseParamsSchema, createCaseReturnSchema, createNestReturnSchema, getContext } from '../context';

const listCases = implRouter({
  $query: implQueryRoute({
    paramsSchema: folderSpecifierSchema,
    returnSchema: caseDataEntriesSchema,
    async resolve({ params: folderSpecifier, metadata }) {
      const {
        cases: { listCases },
      } = getContext(metadata);
      return await listCases(folderSpecifier);
    },
  }),
});

const createCase = implRouter({
  $query: implQueryRoute({
    paramsSchema: createCaseParamsSchema,
    returnSchema: createCaseReturnSchema,
    async resolve({ params, metadata }) {
      const {
        cases: { createCase },
      } = getContext(metadata);
      return await createCase(params);
    },
  }),
});

const createNest = implRouter({
  $query: implQueryRoute({
    paramsSchema: folderSpecifierSchema,
    returnSchema: createNestReturnSchema,
    async resolve({ params: folderSpecifier, metadata }) {
      const {
        cases: { createNest },
      } = getContext(metadata);
      return await createNest(folderSpecifier);
    },
  }),
});

export default implRouter({
  $: {
    listCases,
    createCase,
    createNest,
  },
});
