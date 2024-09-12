import {useEffect, useState} from 'react';
import styled from 'styled-components';
import Editor from '@/components/FileDetail/components/Editor';
import {getEditorTypeByFileSuffix} from '@/utils';

const FileDetailBox = styled.div`
  white-space: pre;
  width: 100%;
  height: 100%;
`;

export default function FileDetail({file}: {file?: File}) {
  const [content, setContent] = useState('');

  const getContent = async () => {
    const text = await file!.text();
    setContent(text);
  };
  useEffect(() => {
    if (file) {
      getContent();
    }
  }, [file]);
  return <FileDetailBox>{content ? <Editor value={content} language={getEditorTypeByFileSuffix(file!.name)} /> : null}</FileDetailBox>;
}
