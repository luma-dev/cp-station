import Box from '@mui/material/Box';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import FolderDrawer from './FolderDrawer';
import Overview from './view/Overview';
import ViewDrawer from './ViewDrawer';

const NewFolder: FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
      }}
    >
      <FolderDrawer />
      <Outlet />
      <ViewDrawer />
      <Overview />
    </Box>
  );
};
export default NewFolder;
