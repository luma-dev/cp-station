import type { TemplateProvider } from '@cp-station/core';
import { book } from '@cp-station/ui/src/locale';
import { useI18n } from '@hi18n/react';
import { useAsync } from '@lumastack/react-async';
import { useAsyncExBrowser } from '@lumastack/react-async-ex-browser';
import CheckIcon from '@mui/icons-material/Check';
import PendingIcon from '@mui/icons-material/Pending';
import ReportIcon from '@mui/icons-material/Report';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { usePostpathClient } from '@swingride/client-postpath-react';
import type { FC } from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { routes } from 'routes-gen';

const setupQuery = routes.$.templates_providers.$.setup.$query;
const listInstancesQuery = routes.$.templates_providers.$.listInstances.$query;
const getDefaultInstanceQuery = routes.$.templates_providers.$.getDefaultInstance.$query;

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Props = {
  provider?: TemplateProvider | null | undefined;
  onClose?: () => void;
};
// ParamsOfQuery<typeof setupQuery>
const CreateFromTemplate: FC<Props> = ({ provider, onClose }) => {
  const { t } = useI18n(book);
  const client = usePostpathClient();
  const open = provider != null;
  const [selected, setSelected] = useState<string>('default');
  const defaultInstance = useAsyncExBrowser(
    {
      fn: (signal) => (provider ? client.query(getDefaultInstanceQuery)(provider, signal) : null),
    },
    [provider],
  );
  const listFolder = useQuery('folder/list');
  const setup = useAsync({
    fn: async (signal) => {
      if (defaultInstance.state !== 'success' || defaultInstance.data == null) return;
      if (provider == null) return;

      await client.query(setupQuery)(
        {
          templateProvider: provider,
          instance: selected === 'default' ? defaultInstance.data : selected.slice(1),
        },
        signal,
      );
    },
    onSuccess() {
      void listFolder.refetch();
      handleClose();
    },
  });
  const instances = useAsyncExBrowser(
    {
      fn: (signal) => (provider ? client.query(listInstancesQuery)(provider, signal) : null),
    },
    [provider],
  );

  const handleClose = () => {
    onClose?.();
  };

  const handleSetup = () => {
    setup.run();
  };

  const ready = defaultInstance.state === 'success' && instances.state === 'success' && setup.state !== 'fetching';

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
            <TextField
              sx={{ flexGrow: 1 }}
              select
              label={t('ui/provider/type')}
              disabled={instances.state !== 'success'}
              value={selected}
              onChange={(ev) => {
                const type: string = ev.target.value;
                setSelected(type);
              }}
            >
              <MenuItem key="default" value="default">
                {`${t('ui/common/default')} (${defaultInstance.data})`}
              </MenuItem>
              ,
              {(() => {
                if (instances.data == null) {
                  return null;
                }
                return instances.data.map((ins) => (
                  <MenuItem key={`:${ins}`} value={`:${ins}`}>
                    {ins}
                  </MenuItem>
                ));
              })()}
            </TextField>
            {(() => {
              if (instances.state === 'error' || defaultInstance.state === 'error') {
                return <ReportIcon color="error" />;
              }
              if (instances.state !== 'success' || defaultInstance.state !== 'success') {
                return <PendingIcon />;
              }
              return <CheckIcon color="success" />;
            })()}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" disabled={!ready} onClick={handleSetup}>
              {t('ui/common/create')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
export default CreateFromTemplate;
