import {useRef, useEffect} from 'react';
import * as monaco from 'monaco-editor';
import styled from 'styled-components';

const EditorBox = styled.div`
  width: 100%;
  height: 100%;
`;

export default function Editor({value, language}: {value: string; language: string}) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = monaco.editor.create(editorRef.current as HTMLDivElement, {
      value,
      language,
      theme: 'vs',
    });
    return () => {
      editor.dispose();
    };
  }, [value, language]);

  return <EditorBox ref={editorRef}></EditorBox>;
}
