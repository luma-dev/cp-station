import type { CaseDataEntry } from '@cp-station/core';
import CheckIcon from '@mui/icons-material/Check';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FolderIcon from '@mui/icons-material/Folder';
import ForumIcon from '@mui/icons-material/Forum';
import PendingIcon from '@mui/icons-material/Pending';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReportIcon from '@mui/icons-material/Report';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import Radio from '@mui/material/Radio';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { usePostpathClient } from '@swingride/client-postpath-react';
import type { FC } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import { useSet } from 'react-use';
import { routes } from 'routes-gen';
import { useFolderId } from '../useFolderId';
import { useListCases } from '../useListCases';
import CaseEditor from './CaseEditor';

const createCaseQuery = routes.$.cases.$.createCase.$query;
const createNestQuery = routes.$.cases.$.createNest.$query;

const CaseEntry: FC<{ caseEntry: CaseDataEntry; indent: number; onSelect?: () => void; selected: boolean }> = ({
  caseEntry,
  indent,
  onSelect,
  selected,
}) => {
  const theme = useTheme();
  return (
    <>
      <Box sx={{ flexShrink: 0, width: '38px' }} />
      <Button
        sx={{
          width: '100%',
          color: theme.palette.grey['700'],
          ml: indent * 3,
          background: selected ? theme.palette.grey['300'] : theme.palette.background.default,
          ':hover': {
            background: selected ? theme.palette.grey['400'] : theme.palette.grey['100'],
          },
        }}
        onClick={() => onSelect?.()}
      >
        {(() => {
          switch (caseEntry.caseData.caseType) {
            case 'input':
              return <TextSnippetIcon sx={{ pr: 1 }} />;
            case 'interact':
              return <ForumIcon sx={{ pr: 1 }} />;
          }
        })()}
        <Typography sx={{ flexGrow: 1, textAlign: 'left' }}>{caseEntry.caseName}</Typography>
      </Button>
      <Button sx={{}}>
        <PlayArrowIcon />
      </Button>
    </>
  );
};

const CaseManager: FC = () => {
  const client = usePostpathClient();
  const folderId = useFolderId();
  const addIconStyle = { width: 24, height: 24 };
  const listCases = useListCases();
  const theme = useTheme();
  const [, openedNest] = useSet<string>();
  const [selectedNest, setSelectedNest] = useState<string | null>(null);
  const selectedRoot = useMemo(() => {
    if (selectedNest == null) return true;
    if (listCases.data == null) return true;
    const found = listCases.data.find((e) => e.type === 'nest' && e.nestData.nestId === selectedNest);
    return found == null;
  }, [listCases.data, selectedNest]);
  useEffect(() => {
    if (selectedNest != null && selectedRoot) {
      setSelectedNest(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNest != null && selectedRoot]);

  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const selectedSomeCase = useMemo(() => {
    if (selectedCase == null) return true;
    if (listCases.data == null) return true;
    const found = listCases.data
      // eslint-disable-next-line array-callback-return
      .flatMap((e) => {
        switch (e.type) {
          case 'single':
            return [e.caseEntry.caseData.caseId];
          case 'nest':
            return e.caseEntries.map((ce) => ce.caseData.caseId);
        }
      })
      .find((caseId) => caseId === selectedCase);
    return found == null;
  }, [listCases.data, selectedCase]);
  useEffect(() => {
    if (selectedCase != null && selectedSomeCase) {
      setSelectedCase(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCase != null && selectedSomeCase]);

  const handleCreateInputCase = () => {
    void client
      .query(createCaseQuery)({ folderSpecifier: { folderId }, caseType: 'input', parentNestId: selectedNest })
      .then(() => {
        return listCases.refetch();
      });
  };

  const handleCreateInteractCase = () => {
    void client
      .query(createCaseQuery)({ folderSpecifier: { folderId }, caseType: 'interact', parentNestId: selectedNest })
      .then(() => {
        return listCases.refetch();
      });
  };

  const handleCreateNest = () => {
    void client
      .query(createNestQuery)({ folderId })
      .then(() => {
        return listCases.refetch();
      });
  };

  const subheader = (
    <ListSubheader component="div" id="nested-list-subheader" sx={{ px: 0 }}>
      <Box sx={{ display: 'flex', width: '100%', gap: 2, px: 1, pt: 1 }}>
        <Button
          component="div"
          variant="dashed"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            py: 1,
          }}
          onClick={handleCreateInputCase}
        >
          <TextSnippetIcon htmlColor={theme.palette.grey['600']} sx={addIconStyle} />
          <Typography
            sx={{
              fontSize: 12,
            }}
          >
            INPUT
          </Typography>
        </Button>
        <Button
          component="div"
          variant="dashed"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            py: 1,
          }}
          onClick={handleCreateInteractCase}
        >
          <ForumIcon htmlColor={theme.palette.grey['600']} sx={addIconStyle} />
          <Typography
            sx={{
              fontSize: 12,
            }}
          >
            INTERACT
          </Typography>
        </Button>
        <Button
          component="div"
          variant="dashed"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            py: 1,
          }}
          onClick={handleCreateNest}
        >
          <FolderIcon htmlColor={theme.palette.grey['600']} sx={addIconStyle} />
          <Typography
            sx={{
              fontSize: 12,
            }}
          >
            NEST
          </Typography>
        </Button>
      </Box>
      <Box sx={{ display: 'flex', px: 0 }}>
        <Radio size="small" checked={selectedRoot} onChange={() => setSelectedNest(null)} />
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
          <Typography>{'<CASES>'}</Typography>
        </Box>
        <Box sx={{ mx: 1 }}>
          {(() => {
            if (listCases.status === 'loading' || listCases.isRefetching) {
              return <PendingIcon />;
            }
            if (listCases.status === 'error') {
              return <ReportIcon color="error" />;
            }
            return <CheckIcon color="success" />;
          })()}
        </Box>
        <Button sx={{}}>
          <FastForwardIcon />
        </Button>
      </Box>
    </ListSubheader>
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
      <Box sx={{ width: '300px', height: '100%', overflowY: 'scroll', pb: 70, flexShrink: 0 }}>
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={subheader}
        >
          {(() => {
            if (listCases.data == null) {
              return <div>TODO</div>;
            }
            // eslint-disable-next-line array-callback-return
            return listCases.data.map((c) => {
              switch (c.type) {
                case 'single':
                  return (
                    <ListItem key={`single:${c.caseEntry.caseData.caseId}`} disablePadding>
                      <CaseEntry
                        caseEntry={c.caseEntry}
                        indent={0}
                        onSelect={() => setSelectedCase(c.caseEntry.caseData.caseId)}
                        selected={selectedCase === c.caseEntry.caseData.caseId}
                      />
                    </ListItem>
                  );
                case 'nest':
                  return (
                    <React.Fragment key={`nest:${c.nestName}`}>
                      <ListItem disablePadding>
                        <Radio
                          size="small"
                          checked={selectedNest === c.nestData.nestId}
                          onChange={() => setSelectedNest(c.nestData.nestId)}
                        />
                        <Button
                          sx={{
                            width: '100%',
                            color: theme.palette.grey['700'],
                            background: theme.palette.background.default,
                            ':hover': {
                              background: theme.palette.grey['100'],
                            },
                          }}
                          onClick={() => openedNest.toggle(c.nestName)}
                        >
                          <FolderIcon sx={{ pr: 1 }} />
                          <Typography sx={{ flexGrow: 1, textAlign: 'left' }}>
                            {c.nestName}/ ({c.caseEntries.length})
                          </Typography>
                          {openedNest.has(c.nestName) ? <ExpandLess /> : <ExpandMore />}
                        </Button>
                        <Button sx={{}}>
                          <FastForwardIcon />
                        </Button>
                      </ListItem>

                      <Collapse in={openedNest.has(c.nestName)} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {c.caseEntries.map((ce) => {
                            return (
                              <ListItem key={ce.caseData.caseId} disablePadding>
                                <CaseEntry
                                  caseEntry={ce}
                                  indent={1}
                                  onSelect={() => setSelectedCase(ce.caseData.caseId)}
                                  selected={selectedCase === ce.caseData.caseId}
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                    </React.Fragment>
                  );
              }
            });
          })()}
        </List>
      </Box>
      <CaseEditor />
    </Box>
  );
};

export default CaseManager;
