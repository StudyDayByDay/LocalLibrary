import styled from 'styled-components';
import add from './assets/svg/add.svg';
import edit from './assets/svg/edit.svg';
import addStatus from './assets/svg/addStatus.svg';
import FileTree from '@/components/FileTree';
import FileDetail from '@/components/FileDetail';
import {useState} from 'react';
import {handleDirectoryToArray} from '@/utils/index.ts';
import FileContext from '@/context/FileContext';
import {TreeData} from '@/types/fileTree';

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
  const [treeData, setTreeData] = useState<TreeData[]>([]);
  const [currentFile, setCurrentFile] = useState<File>();
  const [currentGlobalFolder, setCurrentGlobalFolder] = useState<FileSystemDirectoryHandle>();
  const [currentNode, setCurrentNode] = useState<TreeData>();

  const selectDirectory = async function () {
    try {
      const dirHandle = await window.showDirectoryPicker({mode: 'readwrite'}); // 选择文件夹
      setCurrentGlobalFolder(dirHandle);
      const directoryArray = await handleDirectoryToArray(dirHandle);
      setTreeData(directoryArray);
      setChooseStatus(true);
      console.log(JSON.stringify(directoryArray, null, 2), 111); // 打印结果
    } catch (error) {
      console.error('Error accessing directory:', error);
    }
  };

  const handleSetCurrentNode = async (currentNode: TreeData) => {
    // 读取文件
    if (currentNode.handle.kind === 'file') {
      const file = await currentNode.handle.getFile();
      setCurrentFile(file);
    } else if (!currentNode!.children?.length) {
      // 读取子目录
      currentNode!.children = await handleDirectoryToArray(currentNode.handle);
    }
    setCurrentNode(currentNode);
  };

  return (
    <>
      <FileContext.Provider value={{currentFile, currentNode, handleSetCurrentNode}}>
        <Obsidian>
          <div className="left">
            <div className="tabBar">
              <div className="title">{currentGlobalFolder?.name}</div>
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
