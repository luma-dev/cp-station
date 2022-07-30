import { book } from '@cp-station/ui/src/locale';
import { useI18n } from '@hi18n/react';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderIcon from '@mui/icons-material/Folder';
import PendingIcon from '@mui/icons-material/Pending';
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
import { usePostpathClient } from '@swingride/client-postpath-react';
import type { FC } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { routes } from 'routes-gen';

const listQuery = routes.$.folders.$.list.$query;

const FolderDrawer: FC = () => {
  const { t } = useI18n(book);
  const client = usePostpathClient();
  const iconStyle = { width: 16, height: 16 };
  const addIconStyle = { width: 24, height: 24 };
  const buttonStyle = { flexShrink: 1, flexGrow: 1, height: '100%' };
  const list = useQuery('folder/list', async ({ signal }) => {
    return await client.query(listQuery)(signal);
  });
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
          return list.data.map(({ dirname, data: { name } }) => {
            return (
              <ListItem key={dirname} disablePadding sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                  <Button variant="contained" sx={{ width: '100%', height: '100%', px: 1, py: 2 }}>
                    <Typography component="div" sx={{ fontSize: 15 }}>
                      {name ?? '<NO-NAME>'}
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
            );
          });
        })()}
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
