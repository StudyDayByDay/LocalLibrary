import styled from 'styled-components';
import add from './assets/svg/add.svg';
import edit from './assets/svg/edit.svg';
import addStatus from './assets/svg/addStatus.svg';
import FileTree from '@/components/FileTree';
import FileDetail from '@/components/FileDetail';
import {useState} from 'react';
import {handleSortFiles} from '@/utils/index.ts';
import FileContext from '@/context/FileContext';

const Obsidian = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 100%;
  column-gap: 20px;
  padding: 20px;
  .left {
    display: flex;
    flex-direction: column;
    .tabBar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 10px;
      padding: 5px 20px;
      border: 1px solid #ccc;
      border-radius: 25px;
      &:hover {
        border: 1px solid #1e5cca;
      }
      .title {
        margin-right: auto;
      }
      .icon {
        padding: 5px;
        border-radius: 5px;
        &:hover {
          background-color: #e4e4e4;
        }
        img {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
    }
    .tree {
      position: relative;
      flex: 1;
      padding: 20px;
      margin-top: 20px;
      border: 1px solid #ccc;
      border-radius: 25px;
      overflow: auto;
      scrollbar-width: none; /* Firefox 隐藏滚动条 */
      -ms-overflow-style: none; /* IE 和 Edge 隐藏滚动条 */
      &::-webkit-scrollbar {
        display: none; /* Chrome、Safari 隐藏滚动条 */
      }

      &:has(.none:hover) {
        /* background-color: #b3b0b0; */
        border: 2px dashed #1e5cca;
      }
      &:hover {
        border: 1px solid #1e5cca;
      }
      .none {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }
    }
  }
  .right {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 25px;
    overflow: auto;
    scrollbar-width: none; /* Firefox 隐藏滚动条 */
    -ms-overflow-style: none; /* IE 和 Edge 隐藏滚动条 */
    &::-webkit-scrollbar {
      display: none; /* Chrome、Safari 隐藏滚动条 */
    }
    &:hover {
      border: 1px solid #1e5cca;
    }
  }
`;

function App() {
  const [chooseStatus, setChooseStatus] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [currentFile, setCurrentFile] = useState<File>();
  const [currentFolder, setCurrentFolder] = useState<FileSystemDirectoryHandle>();
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle>();

  const directoryToArray = async function (dirHandle: FileSystemDirectoryHandle) {
    const result = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'directory') {
        const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
        result.push({
          name: entry.name,
          type: 'directory',
          children: await directoryToArray(subDirHandle), // 递归处理子目录
        });
      } else if (entry.kind === 'file') {
        result.push({
          name: entry.name,
          type: 'file',
          fileHandle: entry,
        });
      }
    }

    return result;
  };

  const selectDirectory = async function () {
    try {
      const dirHandle = await window.showDirectoryPicker({mode: 'readwrite'}); // 选择文件夹
      setCurrentFolder(dirHandle);
      const directoryArray = await directoryToArray(dirHandle);
      // 将内容排序
      handleSortFiles(directoryArray);
      setTreeData(directoryArray);
      setChooseStatus(true);
      console.log(JSON.stringify(directoryArray, null, 2), 111); // 打印结果
    } catch (error) {
      console.error('Error accessing directory:', error);
    }
  };

  const getFile = async (fileHandle: FileSystemFileHandle) => {
    // 读取文件
    const file = await fileHandle.getFile();
    // 显示到文件详情
    setCurrentFile(file);
    // 保存文件访问句柄
    setFileHandle(fileHandle);
  };

  return (
    <>
      <FileContext.Provider value={{currentFile, fileHandle, getFile}}>
        <Obsidian>
          <div className="left">
            <div className="tabBar">
              <div className="title">{currentFolder?.name}</div>
              <div className="icon">
                <img src={edit} title="新增文件" />
              </div>
              <div className="icon">
                <img src={add} title="新增文件夹" />
              </div>
            </div>
            <div className="tree">{chooseStatus ? <FileTree treeData={treeData} /> : <img className="none" src={addStatus} onClick={selectDirectory} />}</div>
          </div>
          <div className="right">
            <FileDetail file={currentFile} />
          </div>
        </Obsidian>
      </FileContext.Provider>
    </>
  );
}

export default App;
