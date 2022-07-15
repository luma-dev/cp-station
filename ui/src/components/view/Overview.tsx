import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import type { editor } from 'monaco-editor';
import type { FC } from 'react';
import FullEditor from '../common/FullEditor';

const Overview: FC = () => {
  const code = 'const a = 1;\n'.repeat(100000);
  const options: editor.IStandaloneEditorConstructionOptions = {
    selectOnLineNumbers: true,
    readOnly: true,
  };
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
      <Box sx={{ flexGrow: 6, flexShrink: 1, width: '100%', overflow: 'hidden' }}>
        <FullEditor
          height="600"
          theme="vs-light"
          value={code}
          options={options}
          // onChange={this.onChange}
          // editorDidMount={this.editorDidMount}
        />
      </Box>
      <Box sx={{ flexGrow: 4, flexShrink: 1, width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 4, backgroundColor: theme.palette.primary.main }}>
          <FullEditor
            height="150"
            theme="vs-light"
            value={'abc\ndef\n'}
            options={options}
            // onChange={this.onChange}
            // editorDidMount={this.editorDidMount}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default Overview;
