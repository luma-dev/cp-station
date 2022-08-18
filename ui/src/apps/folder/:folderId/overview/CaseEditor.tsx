import Box from '@mui/material/Box';
import { useState } from 'react';
import { routes } from 'routes-gen';
import FullEditor from '../../../../components/common/FullEditor';

const setCaseInputQuery = routes.$.cases.$.setCaseInput.$query;

const CaseEditor = () => {
  const [inputText, setInputText] = useState('');

  return (
    <Box sx={{ flexGrow: 1, flexShrink: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', height: '120px' }}>1</Box>
      <Box sx={{ width: '100%', flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ height: '30px' }}>hi</Box>
          <Box sx={{ flexGrow: 1 }}>
            <FullEditor value={inputText} onChange={(v) => setInputText(v)} />
          </Box>
        </Box>
        <Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ height: '30px' }}>hi</Box>
          <Box sx={{ flexGrow: 1 }}>
            <FullEditor options={{ readOnly: true }} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '100%', height: '400px' }}>3</Box>
    </Box>
  );
};
export default CaseEditor;
