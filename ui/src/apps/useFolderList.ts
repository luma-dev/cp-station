import { usePostpathClient } from '@swingride/client-postpath-react';
import { useQuery } from 'react-query';
import { routes } from 'routes-gen';

const listQuery = routes.$.folders.$.list.$query;

export const useFolderList = () => {
  const client = usePostpathClient();
  return useQuery('folder/list', async ({ signal }) => {
    return await client.query(listQuery)(signal);
  });
};
