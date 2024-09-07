import {useEffect, useState} from 'react';
import styled from 'styled-components';

const FileDetailBox = styled.div``;

export default function FileDetail({file}: {file: File}) {
  const [content, setContent] = useState('');

  const getContent = async () => {
    const text = await file.text();
    setContent(text);
  };
  useEffect(() => {
    if (file) {
      getContent();
    }
  }, [file]);
  return <FileDetailBox>{content}</FileDetailBox>;
}
