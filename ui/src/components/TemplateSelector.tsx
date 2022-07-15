import type { ProviderType, TemplateProvider, TemplateProviderConfig } from '@cp-station/core';
import { useI18n } from '@hi18n/react';
import { useAsyncExBrowser } from '@lumastack/react-async-ex-browser';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PendingIcon from '@mui/icons-material/Pending';
import ReportIcon from '@mui/icons-material/Report';
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
import { book } from '../locale';

const getConfigQuery = routes.$.templates_providers.$.get.$query;
const setConfigQuery = routes.$.templates_providers.$.set.$query;
const isDirQuery = routes.$.templates_providers.$.checkIsDirectory.$query;
const isTmpQuery = routes.$.templates_providers.$.checkIsTemplateDirStructure.$query;

const providerTypeOptions: Array<{
  value: ProviderType;
  label: string;
}> = [
  {
    value: 'local',
    label: 'local',
  },
];

const defaultProvider = (): TemplateProvider => ({
  path: '',
  name: 'Untitled',
  type: 'local',
});

const TemplateSelector: FC = () => {
  const [index, setIndex] = useState<number>(0);
  const client = usePostpathClient();
  const addIconStyle = { width: 24, height: 24 };
  const [newConfig, setNewConfig] = useState<TemplateProviderConfig | null>(null);
  const setSelectedProvider = (newProvider: TemplateProvider) => {
    if (!newConfig) return;
    setNewConfig([...newConfig.slice(0, index), newProvider, ...newConfig.slice(index + 1)]);
  };
  const selected = useMemo(() => {
    if (!newConfig || !(index in newConfig)) return null;
    return newConfig[index];
  }, [newConfig, index]);
  const getConfig = useAsyncExBrowser<ReturnOfQuery<typeof getConfigQuery>>(
    {
      fn: (signal) => client.query({ query: getConfigQuery, signal }),
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

  const isDir = useAsyncExBrowser(
    {
      fn: async (signal) => {
        if (selected != null) return await client.query({ query: isDirQuery, params: selected.path, signal });
        return false;
      },
    },
    [selected?.path],
  );
  const isTmp = useAsyncExBrowser(
    {
      fn: async (signal) => {
        if (selected != null) return await client.query({ query: isTmpQuery, params: selected.path, signal });
        return false;
      },
    },
    [selected?.path],
  );
  const setConfig = useAsyncExBrowser({
    fn: async (signal) => {
      await client.query({ query: setConfigQuery, params: newConfig, signal });
    },
    onSuccess() {
      getConfigRef.current.run();
    },
  });
  // const { data: config } = useQueryNoCache({
  //   queryFn: ({ signal }) => client.query({ query: configQuery, signal }),
  //   onSuccess: (c) => {
  //     if (!changed) setNewConfig(c);
  //   },
  // });
  // const { data: config } = useQuery<ReturnOfQuery<typeof configQuery>>({
  //   queryKey: 'template/templateProviders',
  //   queryFn: ({ signal }) => client.query({ query: configQuery, signal }),
  //   onSuccess: (c) => {
  //     if (!changed) setNewConfig(c);
  //   },
  //   cacheTime: 0,
  // });
  // const isDir = useQuery({
  //   queryKey: `template/isDirectory/${JSON.stringify(selected?.path ?? null)}`,
  //   queryFn: async ({ signal }) => {
  //     if (selected) return await client.query({ query: isDirectoryQuery, params: selected.path, signal });
  //     return false;
  //   },
  //   cacheTime: 0,
  // });
  // const saveQuery = useAsync({
  //   fn: (params: ParamsOfQuery<typeof setQuery>) => client.query({ query: setQuery, params }),
  // });
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
    if (newConfig == null) return;
    setIndex(0);
    setNewConfig([...newConfig.slice(0, index), ...newConfig.slice(index + 1)]);
  };
  const handleCreateFromTemplate = () => {};
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
          value={selected.type}
          onChange={(ev) => {
            const type: ProviderType = ev.target.value as any;
            setSelectedProvider({
              ...selected,
              type,
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
          value={selected.path}
          onChange={(ev) => {
            const path = ev.target.value;
            setSelectedProvider({
              ...selected,
              path,
            });
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(() => {
            if (isDir.state === 'error') {
              return <ReportIcon color="error" />;
            }
            if (isDir.state === 'fetching') {
              return <PendingIcon />;
            }
            if (isDir.data) {
              return <CheckIcon color="success" />;
            }
            return <CloseIcon color="error" />;
          })()}
          <Typography sx={{ pl: 1 }} variant="body1">
            Is Accessible and Directory
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {(() => {
            if (isTmp.state === 'error') {
              return <ReportIcon color="error" />;
            }
            if (isTmp.state === 'fetching') {
              return <PendingIcon />;
            }
            if (isTmp.data) {
              return <CheckIcon color="success" />;
            }
            return <CloseIcon color="error" />;
          })()}
          <Typography sx={{ pl: 1 }} variant="body1">
            Is CP Template Structure
          </Typography>
        </Box>
      </Box>
      <Box sx={{ flexShrink: 1, height: 20 }} />
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
    <Box sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ flexGrow: 6, flexShrink: 1, width: '100%', overflow: 'hidden', p: 4 }}>
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
    </Box>
  );
};
export default TemplateSelector;
