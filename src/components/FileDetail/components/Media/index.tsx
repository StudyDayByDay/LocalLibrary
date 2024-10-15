import styled from 'styled-components';
import {getMediaType} from '@/utils';
import {useEffect, useState} from 'react';
import ImageView from './components/ImageView';
import VideoView from './components/VideoView';
import DocumentView from './components/DocumentView';

const MediaBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Media({file}: {file: File}) {
  const [fileType, setFileType] = useState('none');

  console.log(file);
  useEffect(() => {
    const fileType = getMediaType(file.name);
    setFileType(fileType);
  }, [file]);
  return (
    <MediaBox>
      {fileType === 'image' && <ImageView file={file} />}
      {fileType === 'video' && <VideoView file={file} />}
      {fileType === 'document' && <DocumentView file={file} />}
    </MediaBox>
  );
}
