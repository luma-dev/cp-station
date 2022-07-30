import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import type { MonacoEditorProps } from 'react-monaco-editor';
import MonacoEditor from 'react-monaco-editor';

type Props = MonacoEditorProps;
const FullEditor: FC<Props> = (props) => {
  const ref = useRef<MonacoEditor>();
  useEffect(() => {
    const handler = () => {
      if (ref.current == null || ref.current.editor == null) return;
      ref.current.editor.layout();
    };
    handler();
    window.addEventListener('resize', handler);
    window.addEventListener('blur', handler);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('blur', handler);
    };
  }, []);

  return <MonacoEditor {...props} ref={ref as any} width="100%" />;
};
export default FullEditor;
