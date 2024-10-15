import {useEffect, useRef, useState} from 'react';

export default function VideoView({file}: {file: File}) {
  const [videoSrc, setVideoSrc] = useState<string>();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
    }
    // 生成临时视频URL
    setVideoSrc(URL.createObjectURL(file));
  }, [file]);
  useEffect(() => {
    if (videoSrc && videoRef.current) {
      videoRef.current.load(); // 重新加载视频
    }
  }, [videoSrc]);
  return (
    <div>
      <video ref={videoRef} controls width="100%" height="100%">
        <source src={videoSrc} type={file.type} />
        你的浏览器不支持视频标签。
      </video>
    </div>
  );
}
