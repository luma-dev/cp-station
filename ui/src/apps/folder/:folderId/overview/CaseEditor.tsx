import Box from '@mui/material/Box';
import FullEditor from '../../../../components/common/FullEditor';

const CaseEditor = () => {
  return (
    <Box sx={{ flexGrow: 1, flexShrink: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', height: '120px' }}>1</Box>
      <Box sx={{ width: '100%', flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <Box sx={{ overflow: 'hidden' }}>
          <FullEditor />
        </Box>
        <Box sx={{ overflow: 'hidden' }}>
          <FullEditor />
        </Box>
      </Box>
      <Box sx={{ width: '100%', height: '400px' }}>3</Box>
    </Box>
  );
};
export default CaseEditor;
