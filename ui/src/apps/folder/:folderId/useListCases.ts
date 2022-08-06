import { usePostpathClient } from '@swingride/client-postpath-react';
import { useQuery } from 'react-query';
import { routes } from 'routes-gen';
import { useFolderId } from './useFolderId';

const query = routes.$.cases.$.listCases.$query;

export const useListCases = () => {
  const folderId = useFolderId();
  const client = usePostpathClient();
  const listCases = useQuery(`cases/${folderId}/list`, async ({ signal }) => {
    return await client.query(query)({ folderId }, signal);
  });
  return listCases;
};
