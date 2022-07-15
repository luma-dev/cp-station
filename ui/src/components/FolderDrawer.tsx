import { useI18n } from '@hi18n/react';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderIcon from '@mui/icons-material/Folder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { common, grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { book } from '../locale';

const FolderDrawer: FC = () => {
  const { t } = useI18n(book);
  const iconStyle = { width: 16, height: 16 };
  const addIconStyle = { width: 24, height: 24 };
  const buttonStyle = { flexShrink: 1, flexGrow: 1, height: '100%' };
  return (
    <Box
      sx={{
        width: 120,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRightWidth: 4,
        borderRightColor: common.black,
      }}
    >
      <Toolbar />
      <Divider />
      <List sx={{ width: '100%' }}>
        <ListItem disablePadding sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
            <Button variant="contained" sx={{ width: '100%', height: '100%' }}>
              <Typography component="div" variant="subtitle1">
                A1
              </Typography>
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
              <Tooltip title={t('action/copy-path')} placement="top">
                <Button sx={buttonStyle}>
                  <FolderIcon htmlColor={grey['600']} sx={iconStyle} />
                </Button>
              </Tooltip>
              <Tooltip title={t('action/run-all')} placement="top">
                <Button sx={buttonStyle}>
                  <PlayArrowIcon htmlColor={grey['600']} sx={iconStyle} />
                </Button>
              </Tooltip>
              <Tooltip title={t('action/copy')} placement="top">
                <Button sx={buttonStyle}>
                  <ContentCopyIcon htmlColor={grey['600']} sx={iconStyle} />
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </ListItem>
        <ListItem disablePadding sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
            <Link to="/new-folder">
              <Button
                component="div"
                variant="dashed"
                sx={{
                  width: '100%',
                  height: '100%',
                  py: 2,
                }}
              >
                <AddIcon htmlColor={grey['600']} sx={addIconStyle} />
              </Button>
            </Link>
          </Box>
        </ListItem>
      </List>
    </Box>
  );
};
export default FolderDrawer;
