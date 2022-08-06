import { useAsync } from '@lumastack/react-async';
import { useFuture } from '@lumastack/use-future';
import { usePostpathClient } from '@swingride/client-postpath-react';
import { useRef } from 'react';
import { useQuery } from 'react-query';
import { routes } from 'routes-gen';

const getQuery = routes.$.folders.$.getById.$query;
const setNameQuery = routes.$.folders.$.setFolderName.$query;

export const useFolder = (folderId: string | null) => {
  const client = usePostpathClient();
  const folder = useQuery(`folder/${JSON.stringify(folderId)}`, async ({ signal }) => {
    if (!folderId) return null;
    return await client.query(getQuery)({ folderId }, signal);
  });

  const setNameArg = useRef({ newFolderName: '' });
  const setName = useAsync({
    async fn(signal) {
      if (folderId == null) throw new Error('folder id should be string');
      return await client.query(setNameQuery)({ folderSpecifier: { folderId }, ...setNameArg.current }, signal);
    },
  });
  const setNameFuture = useFuture(setName);
  const setNameRun = async (arg: typeof setNameArg.current) => {
    setNameArg.current = arg;
    await setNameFuture().run();
  };
  return {
    folder,
    setName,
    setNameRun,
  };
};
