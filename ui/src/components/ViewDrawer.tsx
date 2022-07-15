import { useI18n } from '@hi18n/react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import { common, grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ToggleButton from '@mui/material/ToggleButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import type { FC } from 'react';
import { book } from '../locale';

const ViewDrawer: FC = () => {
  const { t } = useI18n(book);
  const iconStyle = { width: 40, height: 40 };
  const buttonStyle = { height: '100%' };
  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRightWidth: 4,
        borderRightColor: common.black,
        overflow: 'hidden',
      }}
    >
      <Toolbar />
      <Divider />

      <List sx={{ width: '100%' }}>
        <ListItem disablePadding sx={{ width: '100%' }}>
          <Tooltip title={t.todo('views/overview')} placement="top">
            <ToggleButton sx={buttonStyle} value="overview" selected>
              <DashboardIcon htmlColor={grey['600']} sx={iconStyle} />
            </ToggleButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );
};
export default ViewDrawer;
