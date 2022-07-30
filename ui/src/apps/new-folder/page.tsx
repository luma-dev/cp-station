import type { ProviderType, TemplateProviderConfig, TemplateProviderConfigFile } from '@cp-station/core';
import { book } from '@cp-station/ui/src/locale';
import { useI18n } from '@hi18n/react';
import { useAsyncExBrowser } from '@lumastack/react-async-ex-browser';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PendingIcon from '@mui/icons-material/Pending';
import ReportIcon from '@mui/icons-material/Report';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { grey } from '@mui/material/colors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import { usePostpathClient } from '@swingride/client-postpath-react';
import type { ReturnOfQuery } from '@swingride/core';
import objectHash from 'object-hash';
import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { routes } from 'routes-gen';
import CreateFromTemplate from './CreateFromTemplate';

const getConfigQuery = routes.$.templates_providers.$.get.$query;
const setConfigQuery = routes.$.templates_providers.$.set.$query;
const validateQuery = routes.$.templates_providers.$.validate.$query;

const providerTypeOptions: Array<{
  value: ProviderType;
  label: string;
}> = [
  {
    value: 'local',
    label: 'local',
  },
];

const defaultProvider = (): TemplateProviderConfig => ({
  name: 'Untitled',
  provider: {
    type: 'local',
    templatePath: '',
  },
});

const NewFolder: FC = () => {
  const [index, setIndex] = useState<number | null>(null);
  const client = usePostpathClient();
  const addIconStyle = { width: 24, height: 24 };
  const [newConfig, setNewConfig] = useState<TemplateProviderConfigFile | null>(null);
  const [creatingProvider, setCreatingProvider] = useState<TemplateProviderConfig | null>(null);
  const setSelectedProvider = (newProvider: TemplateProviderConfig) => {
    if (!newConfig || index == null) return;
    setNewConfig([...newConfig.slice(0, index), newProvider, ...newConfig.slice(index + 1)]);
  };
  const selected = useMemo(() => {
    if (!newConfig || index == null || !(index in newConfig)) return null;
    return newConfig[index];
  }, [newConfig, index]);
  const getConfig = useAsyncExBrowser<ReturnOfQuery<typeof getConfigQuery>>(
    {
      fn: (signal) => client.query(getConfigQuery)(signal),
      onSuccess: (c) => {
        // WHY-REF: for change(false => true) with focusing.
        if (!changedRef.current) setNewConfig(c);
      },
    },
    [],
  );
  const getConfigRef = useRef(getConfig);
  useEffect(() => {
    getConfigRef.current = getConfig;
  }, [getConfig]);

  const validate = useAsyncExBrowser(
    {
      fn: async (signal) => {
        if (selected != null) {
          return await client.query(validateQuery)(selected.provider, signal);
        }
        return null;
      },
    },
    [selected],
  );
  const setConfig = useAsyncExBrowser({
    fn: async (signal) => {
      if (newConfig != null) {
        await client.query(setConfigQuery)(newConfig, signal);
      }
    },
    onSuccess() {
      getConfigRef.current.run();
    },
  });
  const changed = useMemo(() => {
    if (getConfig.data == null) {
      return newConfig != null;
    }
    return objectHash(newConfig) !== objectHash(getConfig.data);
  }, [newConfig, getConfig.data]);
  const changedRef = useRef(false);
  useEffect(() => {
    changedRef.current = changed;
  }, [changed]);
  const { t } = useI18n(book);

  const handleDelete = () => {
    if (newConfig == null || index == null) return;
    setIndex(null);
    setNewConfig([...newConfig.slice(0, index), ...newConfig.slice(index + 1)]);
  };
  const handleCreateFromTemplate = () => {
    if (newConfig == null || index == null) return;
    const provider = newConfig[index];
    setCreatingProvider(provider);
  };
  const handleAdd = () => {
    setNewConfig([...(newConfig || []), defaultProvider()]);
    setIndex((newConfig || []).length);
  };
  const handleSave = () => {
    setConfig.run();
  };

  const templateEdit = selected && (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            color="success"
            sx={{ height: 80, width: '100%' }}
            onClick={handleCreateFromTemplate}
          >
            {t('ui/common/create from this template')}
          </Button>
        </Box>
        <TextField
          label={t('ui/provider/name')}
          value={selected.name}
          onChange={(ev) => {
            const name: string = ev.target.value as any;
            setSelectedProvider({
              ...selected,
              name,
            });
          }}
        />
        <TextField
          select
          label={t('ui/provider/type')}
          value={selected.provider.type}
          onChange={(ev) => {
            const type: ProviderType = ev.target.value as any;
            setSelectedProvider({
              ...selected,
              provider: {
                ...selected.provider,
                type,
              },
            });
          }}
        >
          {providerTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label={t('ui/provider/path')}
          value={selected.provider.templatePath}
          onChange={(ev) => {
            const templatePath = ev.target.value;
            setSelectedProvider({
              ...selected,
              provider: {
                ...selected.provider,
                templatePath,
              },
            });
          }}
        />
      </Box>
      <Box sx={{ flexShrink: 1, mt: 4 }}>
        {(() => {
          if (validate.data == null) {
            return <PendingIcon />;
          }
          return validate.data.messages.map(({ message, status }) => {
            return (
              <Box key={message} sx={{ display: 'flex', alignItems: 'center' }}>
                {(() => {
                  if (validate.state === 'error') {
                    return <ReportIcon color="error" />;
                  }
                  if (validate.state === 'fetching') {
                    return <PendingIcon />;
                  }
                  if (status === false) {
                    return <CloseIcon color="error" />;
                  }
                  if (status === true) {
                    return <CheckIcon color="success" />;
                  }
                  if (status === 'skipped') {
                    return <SkipNextIcon color="warning" />;
                  }
                })()}
                <Typography sx={{ pl: 1 }} variant="body1">
                  {message}
                </Typography>
              </Box>
            );
          });
        })()}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button variant="outlined" color="error" sx={{ mt: 4 }} onClick={handleDelete}>
          {t('ui/common/delete')}
        </Button>
      </Box>
    </>
  );

  const right = (() => {
    if (selected) return templateEdit;
    return null;
  })();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flexGrow: 6,
          flexShrink: 1,
          width: '100%',
          overflow: 'hidden',
          p: 4,
        }}
      >
        {(() => {
          if (newConfig == null) {
            return (
              <>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </>
            );
          }
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <List sx={{ width: '100%' }}>
                {newConfig
                  .map((prov, i) => [prov, i] as const)
                  .map(([prov, i]) => {
                    return (
                      <ListItem disablePadding sx={{ pb: 1 }} key={i}>
                        <ToggleButton
                          value="overview"
                          autoCapitalize="false"
                          selected={index === i}
                          sx={{
                            width: '100%',
                            height: 40,
                            textAlign: 'left',
                            textTransform: 'none',
                          }}
                          onClick={() => {
                            setIndex(i);
                          }}
                        >
                          {prov.name}
                        </ToggleButton>
                      </ListItem>
                    );
                  })}
                <ListItem disablePadding sx={{ width: '100%', display: 'block' }}>
                  <Button
                    variant="dashed"
                    sx={{
                      width: '100%',
                      height: '100%',
                      py: 2,
                    }}
                    onClick={handleAdd}
                  >
                    <AddIcon htmlColor={grey['600']} sx={addIconStyle} />
                  </Button>
                </ListItem>
              </List>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleSave}
                  disabled={(() => {
                    if (setConfig.state === 'fetching') {
                      return true;
                    }
                    return false;
                  })()}
                >
                  {t('ui/common/save')}
                </Button>
                <Box sx={{ width: 64, ml: 2 }}>
                  {(() => {
                    if (setConfig.state === 'error') {
                      return <ReportIcon color="error" />;
                    }
                    if (getConfig.state === 'fetching' || setConfig.state === 'fetching') {
                      return <PendingIcon />;
                    }
                    if (changed) {
                      return <EditIcon color="warning" />;
                    }
                    return <CheckIcon color="success" />;
                  })()}
                </Box>
              </Box>
            </Box>
          );
        })()}
      </Box>
      <Box
        sx={{
          flexGrow: 4,
          flexShrink: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          p: 4,
        }}
      >
        {right}
      </Box>
      <CreateFromTemplate provider={creatingProvider?.provider} onClose={() => setCreatingProvider(null)} />
    </Box>
  );
};
export default NewFolder;
