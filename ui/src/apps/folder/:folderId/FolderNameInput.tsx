import { useFuture } from '@lumastack/use-future';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PendingIcon from '@mui/icons-material/Pending';
import ReportIcon from '@mui/icons-material/Report';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import pDebounce from 'p-debounce';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useFolderList } from '../../useFolderList';
import { useFolder } from './useFolder';

type Props = {
  folderId: string;
};
const FolderNameInput: FC<Props> = ({ folderId }) => {
  const { folder, setName, setNameRun } = useFolder(folderId);
  const [newName, setNewName] = useState<string | null>(null);
  const newNameFuture = useFuture(newName);
  const list = useFolderList();

  useEffect(() => {
    if (newName === null && folder.data != null) {
      setNewName(folder.data.folderName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newName === null && folder.data != null]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetNewNameRun = useCallback(
    pDebounce(async () => {
      // SAFETY: Once set non-null value, it only returns non-null value.
      await setNameRun({ newFolderName: newNameFuture()! });
      await Promise.all([folder.refetch(), list.refetch()]);
    }, 1000),
    [],
  );

  const handleEdit = (name: string) => {
    setNewName(name.toLowerCase());
    void debouncedSetNewNameRun();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TextField
        label="Folder name /^[^^`\s/\\!*%#$?]+$/"
        variant="outlined"
        value={newName == null ? '...' : newName}
        sx={{ flexGrow: 1 }}
        disabled={newName == null}
        onChange={(ev) => handleEdit(ev.target.value)}
      />
      <Box sx={{ mx: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {(() => {
          if (folder.status === 'loading' || folder.isRefetching || setName.state === 'fetching') {
            return <PendingIcon />;
          }
          if (folder.status === 'error' || setName.state === 'error') {
            return <ReportIcon color="error" />;
          }
          if (folder.data != null && folder.data.folderName !== newName) {
            return <EditIcon color="warning" />;
          }
          if (folder.data === null) {
            return <CloseIcon color="error" />;
          }
          return <CheckIcon color="success" />;
        })()}
      </Box>
    </Box>
  );
};
export default FolderNameInput;
