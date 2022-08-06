import Box from '@mui/material/Box';
import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import ViewDrawer from './ViewDrawer';

const Folder: FC = () => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexGrow: 1,
      }}
    >
      <ViewDrawer />
      <Outlet />
    </Box>
  );
};
export default Folder;
