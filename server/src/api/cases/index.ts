import { caseDataEntriesSchema, folderSpecifierSchema } from '@cp-station/core';
import { implQueryRoute, implRouter } from '@swingride/core';
import { getContext } from '../context';

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

export default implRouter({
  $: {
    listCases,
  },
});
