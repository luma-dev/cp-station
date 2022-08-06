import FullEditor from '@cp-station/ui/src/components/common/FullEditor';
import type { editor } from 'monaco-editor';
import type { FC } from 'react';
import { useBundledCode } from './useBundledCode';

type Props = {};
const BundledCode: FC<Props> = () => {
  const bundledCode = useBundledCode();
  const code = (() => {
    return bundledCode.data ?? 'loading...';
  })();
  const options: editor.IStandaloneEditorConstructionOptions = {
    selectOnLineNumbers: true,
    readOnly: true,
  };

  return (
    <FullEditor
      height="600"
      theme="vs-light"
      value={code}
      options={options}
      // onChange={this.onChange}
      // editorDidMount={this.editorDidMount}
    />
  );
};
export default BundledCode;
