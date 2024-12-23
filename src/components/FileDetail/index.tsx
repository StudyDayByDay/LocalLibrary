import {useEffect, useState} from 'react';
import styled from 'styled-components';
import Editor from '@/components/FileDetail/components/Editor';
import Media from '@/components/FileDetail/components/Media';
import {getEditorTypeByFileSuffix, isMediaFile} from '@/utils';
import SvgIcon from '@/components/FileTree/components/SvgIcon';

const FileDetailBox = styled.div`
  white-space: pre;
  width: 100%;
  height: 100%;
  .file-title {
    height: 30px;
    padding: 0 28px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
  }

  .file-detail {
    height: calc(100% - 30px);
  }

  .warm-tips {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7b7a7a;
  }
`;

export default function FileDetail({file, chooseStatus}: {file?: File; chooseStatus: boolean}) {
  const [content, setContent] = useState('');

  const getContent = async () => {
    const text = await file!.text();
    setContent(text || '');
  };
  useEffect(() => {
    if (file) {
      getContent();
    }
  }, [file]);
  return (
    <FileDetailBox>
      {file ? (
        <>
          <div className="file-title">
            <SvgIcon fileName={file?.name} />
            {file?.name}
          </div>
          <div className="file-detail">
            {/* 图片、svg、word、ppt、视频 */}
            {isMediaFile(file?.name) ? <Media file={file} /> : <Editor value={content} language={getEditorTypeByFileSuffix(file!.name)} />}
          </div>
        </>
      ) : chooseStatus ? null : (
        <div className="warm-tips">请点击左侧加号选择文件夹</div>
      )}
    </FileDetailBox>
  );
}
