import styled from 'styled-components';
import {getMediaType} from '@/utils';
import {useEffect, useRef, useState} from 'react';

const MediaBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Media({file}: {file: File}) {
  const [fileType, setFileType] = useState('none');
  const [imageSrc, setImageSrc] = useState<string>();
  const [videoSrc, setVideoSrc] = useState<string>();
  const videoRef = useRef(null);

  console.log(file);
  const imageView = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    return (
      <div
        style={{
          backgroundImage:
            'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={imageSrc}
          alt="Preview"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    );
  };
  const videoView = () => {
    return (
      <div>
        <video ref={videoRef} controls width="100%" height="100%">
          <source src={videoSrc} type={file.type} />
          你的浏览器不支持视频标签。
        </video>
      </div>
    );
  };
  const documentView = () => {
    return <h1>document</h1>;
  };
  useEffect(() => {
    const fileType = getMediaType(file.name);
    setFileType(fileType);
    if (fileType === 'video') {
      // 如果存在之前的就先清除
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
      // 生成临时视频URL
      setVideoSrc(URL.createObjectURL(file));
    }
  }, [file]);

  useEffect(() => {
    if (videoSrc && videoRef.current) {
      videoRef.current.load(); // 重新加载视频
    }
  }, [videoSrc]);
  return (
    <MediaBox>
      {fileType === 'image' && imageView()}
      {fileType === 'video' && videoView()}
      {fileType === 'document' && documentView()}
    </MediaBox>
  );
}
