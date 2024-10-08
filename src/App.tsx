import styled from 'styled-components';
import add from './assets/svg/add.svg';
import edit from './assets/svg/edit.svg';
import addStatus from './assets/svg/addStatus.svg';
import FileTree from '@/components/FileTree';
import FileDetail from '@/components/FileDetail';
import {useEffect, useState} from 'react';
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
  const [operateFlag, setOperateFlag] = useState(false);

  useEffect(() => {
    document.addEventListener('keydown', function (event) {
      // 检查是否按下了 Command (Mac) 或 Ctrl (Windows) + S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // 阻止浏览器的默认保存行为
      }
    });
  }, []);

  // 选择初始文件
  const selectDirectory = async function () {
    try {
      const dirHandle = await window.showDirectoryPicker({mode: 'readwrite'}); // 选择文件夹
      setCurrentGlobalFolder(dirHandle);
      const directoryArray = await handleDirectoryToArray(dirHandle, {
        name: 'TOP',
        type: 'directory',
        handle: dirHandle,
        parentHandle: dirHandle,
        parentNode: undefined,
      });
      setTreeData(directoryArray);
      setChooseStatus(true);
      console.log(JSON.stringify(directoryArray, null, 2), 111); // 打印结果
    } catch (error) {
      console.error('Error accessing directory:', error);
    }
  };

  // 设定当前选中的node
  const handleSetCurrentNode = async (currentNode: TreeData) => {
    // 读取文件
    if (currentNode.handle.kind === 'file') {
      const file = await currentNode.handle.getFile();
      setCurrentFile(file);
    } else if (!currentNode!.children?.length) {
      // 读取子目录
      currentNode!.children = await handleDirectoryToArray(currentNode.handle, currentNode);
    }
    setCurrentNode(currentNode);
  };

  // 显示文件编辑框
  const handleAddFileEdit = () => {
    // 判断是否是全局的还是局部的
    const handleArr: TreeData[] = (currentNode ? currentNode.children || currentNode.parentNode?.children || treeData : treeData) as TreeData[],
      placeNode: TreeData = {
        name: 'null',
        type: 'fileEdit',
        handle: currentGlobalFolder!,
        parentHandle: currentGlobalFolder!,
        parentNode: currentNode ? currentNode.parentNode : undefined,
      };
    if (operateFlag) {
      handleArr[0].type = 'fileEdit';
    } else {
      handleArr.unshift(placeNode);
    }
    setTreeData([...treeData]);
    setOperateFlag(true);
  };

  // 隐藏文件编辑框逻辑
  const handleHiddenFileEdit = async (value: string) => {
    // 判断是否是全局的还是局部的
    const handle = currentNode ? (currentNode.children ? currentNode.handle : currentNode.parentHandle) : currentGlobalFolder,
      handleArr = currentNode ? (currentNode.children ? currentNode.children : currentNode.parentNode?.children || treeData) : treeData,
      parentNode = currentNode
        ? currentNode.children
          ? currentNode
          : currentNode.parentNode
        : ({
            name: 'TOP',
            type: 'directory',
            handle: currentGlobalFolder,
            parentHandle: currentGlobalFolder,
            parentNode: undefined,
          } as TreeData);
    if (value) {
      // 新增文件逻辑
      await (handle as FileSystemFileHandle).getFileHandle(value, {create: true});
      const arr = await handleDirectoryToArray(handle as FileSystemDirectoryHandle, parentNode);
      handleArr!.length = 0;
      handleArr!.push(...arr);
    } else {
      // 回退文件编辑逻辑，文件编辑状态为false
      handleArr!.shift();
    }
    setTreeData([...treeData]);
    setOperateFlag(false);
  };

  // 显示文件夹编辑框
  const handleAddDirectoryEdit = () => {
    // 判断是否是全局的还是局部的
    const handleArr: TreeData[] = (currentNode ? currentNode.children || currentNode.parentNode?.children || treeData : treeData) as TreeData[],
      placeNode: TreeData = {
        name: 'null',
        type: 'directoryEdit',
        handle: currentGlobalFolder!,
        children: [],
        parentHandle: currentGlobalFolder!,
        parentNode: currentNode ? currentNode.parentNode : undefined,
      };
    if (operateFlag) {
      handleArr[0].type = 'directoryEdit';
    } else {
      handleArr.unshift(placeNode);
    }
    setTreeData([...treeData]);
    setOperateFlag(true);
  };

  // 隐藏文件夹编辑框逻辑
  const handleHiddenDirectoryEdit = async (value: string) => {
    // 判断是否是全局的还是局部的
    const handle = currentNode ? (currentNode.children ? currentNode.handle : currentNode.parentHandle) : currentGlobalFolder,
      handleArr = currentNode ? (currentNode.children ? currentNode.children : currentNode.parentNode?.children || treeData) : treeData,
      parentNode = currentNode
        ? currentNode.children
          ? currentNode
          : currentNode.parentNode
        : ({
            name: 'TOP',
            type: 'directory',
            handle: currentGlobalFolder,
            parentHandle: currentGlobalFolder,
            parentNode: undefined,
          } as TreeData);
    if (value) {
      // 新增文件逻辑
      await (handle as FileSystemFileHandle).getDirectoryHandle(value, {create: true});
      const arr = await handleDirectoryToArray(handle as FileSystemDirectoryHandle, parentNode);
      handleArr!.length = 0;
      handleArr!.push(...arr);
    } else {
      // 回退文件编辑逻辑，文件编辑状态为false
      handleArr!.shift();
    }
    setTreeData([...treeData]);
    setOperateFlag(false);
  };

  const handleTreePanelClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 确保只有在点击父级元素本身时才触发
    // event.target：表示实际被点击的元素
    // event.currentTarget：表示绑定事件的元素
    if (event.target === event.currentTarget) {
      setCurrentNode(undefined);
    }
  };

  return (
    <>
      <FileContext.Provider value={{currentFile, currentNode, handleSetCurrentNode, handleHiddenFileEdit, handleHiddenDirectoryEdit}}>
        <Obsidian>
          <div className="left">
            <div className="tabBar">
              <div className="title">{currentGlobalFolder?.name}</div>
              <div className="icon" onClick={handleAddFileEdit}>
                <img src={edit} title="新增文件" />
              </div>
              <div className="icon" onClick={handleAddDirectoryEdit}>
                <img src={add} title="新增文件夹" />
              </div>
            </div>
            <div className="tree" onClick={handleTreePanelClick}>
              {chooseStatus ? <FileTree treeData={treeData} /> : <img className="none" src={addStatus} onClick={selectDirectory} />}
            </div>
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
