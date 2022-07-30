import Box from '@mui/material/Box';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import FolderDrawer from './FolderDrawer';

const Root: FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
      }}
    >
      <FolderDrawer />
      <Outlet />
    </Box>
  );
};
export default Root;
