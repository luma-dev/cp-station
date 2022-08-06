import { book } from '@cp-station/ui/src/locale';
import { useI18n } from '@hi18n/react';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderIcon from '@mui/icons-material/Folder';
import PendingIcon from '@mui/icons-material/Pending';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useTheme } from '@mui/material';
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
import { Link, useLocation } from 'react-router-dom';
import { useFolderList } from './useFolderList';

const fontSizeOfLen = (len: number) => {
  if (len < 6) return 15;
  if (len < 12) return 14;
  return 12;
};

const FolderDrawer: FC = () => {
  const { t } = useI18n(book);
  const iconStyle = { width: 16, height: 16 };
  const addIconStyle = { width: 24, height: 24 };
  const buttonStyle = { flexShrink: 1, flexGrow: 1, height: '100%' };
  const theme = useTheme();
  const list = useFolderList();
  const isOnPageNew = useLocation().pathname === '/new-folder';
  // const list = useAsyncExBrowser(
  //   {
  //     fn: async (signal) => {
  //     },
  //   },
  //   [],
  // );
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
        {(() => {
          if (list.data == null) {
            return (
              <ListItem disablePadding sx={{ width: '100%', mb: 2 }}>
                <PendingIcon />
              </ListItem>
            );
          }
          return list.data.map(({ folderName, folderData: { folderId } }) => {
            return (
              <ListItem key={folderId} disablePadding sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                  <Link to={`/folder/${folderId}/overview`}>
                    <Button variant="contained" component="div" sx={{ width: '100%', px: 1, py: 2, height: '80px' }}>
                      <Typography
                        component="div"
                        sx={{
                          fontSize: fontSizeOfLen(folderName.length),
                          overflowWrap: 'break-word',
                          maxWidth: '100%',
                        }}
                      >
                        {folderName ?? '<NO-NAME>'}
                      </Typography>
                    </Button>
                  </Link>
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
            );
          });
        })()}
        <ListItem disablePadding sx={{ width: '100%', px: 1 }}>
          <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
            <Link to="/new-folder">
              <Button
                component="div"
                variant="dashed"
                sx={{
                  width: '100%',
                  height: '100%',
                  py: 2,
                  background: isOnPageNew ? theme.palette.grey['300'] : theme.palette.background.default,
                  ':hover': {
                    background: isOnPageNew ? theme.palette.grey['400'] : theme.palette.grey['100'],
                  },
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
