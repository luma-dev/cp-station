import { usePostpathClient } from '@swingride/client-postpath-react';
import { useQuery } from 'react-query';
import { routes } from 'routes-gen';
import { useFolderId } from './useFolderId';

const getQuery = routes.$.folders.$.getBundledCode.$query;

export const useBundledCode = () => {
  const folderId = useFolderId();
  const client = usePostpathClient();
  const bundledCode = useQuery(`folder/${folderId}/bundled-code`, async ({ signal }) => {
    return await client.query(getQuery)({ folderId }, signal);
  });
  return bundledCode;
};
