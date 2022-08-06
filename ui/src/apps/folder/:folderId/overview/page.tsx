import Box from '@mui/material/Box';
import type { FC } from 'react';
import BundledCode from '../BundledCode';
import FolderNameInput from '../FolderNameInput';
import { useFolderId } from '../useFolderId';
import CaseManager from './CaseManager';

const Overview: FC = () => {
  const folderId = useFolderId();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 8fr', width: '100%', overflow: 'hidden' }}>
      <Box sx={{ flexShrink: 1, width: '100%', overflow: 'hidden' }}>
        <BundledCode />
        <Box sx={{ mt: 4, ml: 1 }}>
          <FolderNameInput key={folderId} folderId={folderId} />
        </Box>
      </Box>
      <Box sx={{ flexShrink: 1, width: '100%', overflow: 'hidden' }}>
        <CaseManager />
      </Box>
    </Box>
  );
};
export default Overview;
