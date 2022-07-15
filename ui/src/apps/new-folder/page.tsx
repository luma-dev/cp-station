import Box from '@mui/material/Box';
import type { FC } from 'react';
import TemplateSelector from '../../components/TemplateSelector';

const NewFolder: FC = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <TemplateSelector />
    </Box>
  );
};
export default NewFolder;
