import styled from 'styled-components';
import add from './assets/svg/add.svg';
import edit from './assets/svg/edit.svg';
import addStatus from './assets/svg/addStatus.svg';
import FileTree from './components/FileTree';
import {useState} from 'react';

const Obsidian = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto;
  column-gap: 20px;
  padding: 20px;
  .left {
    display: flex;
    flex-direction: column;
    /* background-color: pink; */
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
    &:hover {
      border: 1px solid #1e5cca;
    }
  }
`;

function App() {
  const [chooseStatus, setChooseStatus] = useState(false);
  const [treeData, setTreeData] = useState([]);

  const directoryToArray = async function (dirHandle: FileSystemDirectoryHandle) {
    const result = [];

    for await (const entry of dirHandle.values()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
        continue;
      }
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
        });
      }
    }

    return result;
  };

  const selectDirectory = async function () {
    try {
      const dirHandle = await window.showDirectoryPicker(); // 选择文件夹
      const directoryArray = await directoryToArray(dirHandle);
      setTreeData(directoryArray);
      setChooseStatus(true);
      console.log(JSON.stringify(directoryArray, null, 2), 111); // 打印结果
    } catch (error) {
      console.error('Error accessing directory:', error);
    }
  };

  return (
    <>
      <Obsidian>
        <div className="left">
          <div className="tabBar">
            <div className="icon">
              <img src={edit} title="新增文件" />
            </div>
            <div className="icon">
              <img src={add} title="新增文件夹" />
            </div>
          </div>
          <div className="tree">{chooseStatus ? <FileTree treeData={treeData} /> : <img className="none" src={addStatus} onClick={selectDirectory} />}</div>
        </div>
        <div className="right">文件详情</div>
      </Obsidian>
    </>
  );
}

export default App;
