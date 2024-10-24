import styled from 'styled-components';
import folderAdd from './assets/svg/folder-add.svg';
import fileAdd from './assets/svg/file-add.svg';
import refresh from './assets/svg/sync.svg';
import batchFolding from './assets/svg/batch-folding.svg';
import addStatus from './assets/svg/addStatus.svg';
import FileTree from '@/components/FileTree';
import FileDetail from '@/components/FileDetail';
import {useEffect, useState} from 'react';
import {handleDirectoryToArray, renameFile, renameDirectory} from '@/utils/index.ts';
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
    position: relative;
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
      .loader {
        --s: 25px;
        --g: 5px;

        position: absolute;
        z-index: 99;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(2 * (1.353 * var(--s) + var(--g)));
        aspect-ratio: 1;
        background: linear-gradient(#1e5cca 0 0) left/50% 100% no-repeat, conic-gradient(from -90deg at var(--s) calc(0.353 * var(--s)), #fff 135deg, #666 0 270deg, #aaa 0);
        background-blend-mode: multiply;
        --_m: linear-gradient(to bottom right, #0000 calc(0.25 * var(--s)), #000 0 calc(100% - calc(0.25 * var(--s)) - 1.414 * var(--g)), #0000 0),
          conic-gradient(from -90deg at right var(--g) bottom var(--g), #000 90deg, #0000 0);
        -webkit-mask: var(--_m);
        mask: var(--_m);
        background-size: 50% 50%;
        -webkit-mask-size: 50% 50%;
        mask-size: 50% 50%;
        -webkit-mask-composite: source-in;
        mask-composite: intersect;
        animation: l9 1.5s infinite;
      }
      @keyframes l9 {
        0%,
        12.5% {
          background-position: 0% 0%, 0 0;
        }
        12.6%,
        37.5% {
          background-position: 100% 0%, 0 0;
        }
        37.6%,
        62.5% {
          background-position: 100% 100%, 0 0;
        }
        62.6%,
        87.5% {
          background-position: 0% 100%, 0 0;
        }
        87.6%,
        100% {
          background-position: 0% 0%, 0 0;
        }
      }
    }
    .modal-overlay {
      pointer-events: none;
      cursor: not-allowed;
      background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 20%, rgba(0, 0, 0, 0.2) 100%);
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    }
    @keyframes fadeIn {
      to {
        opacity: 1;
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
  const [loading, setLoading] = useState(false);

  const listenKeydown = (event: KeyboardEvent) => {
    // 判断是否按下了 Ctrl 或者 Command 键
    const isCtrlOrCmdPressed = event.ctrlKey || event.metaKey;

    // 检查是否按下了 Command (Mac) 或 Ctrl (Windows) + S
    if (isCtrlOrCmdPressed && event.key.toLowerCase() === 's') {
      event.preventDefault(); // 阻止浏览器的默认保存行为
    }

    // 判断是否同时按下 Command (Mac) 或 Ctrl (Windows) + Shift 键和 'L' 键
    if (isCtrlOrCmdPressed && event.shiftKey && event.key.toLowerCase() === 'l') {
      // 阻止默认行为（如果需要）
      event.preventDefault();
      window.open(location.href, '_blank');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', listenKeydown);
    // return document.removeEventListener('keydown', listenKeydown);
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
  const handleSetCurrentNode = async (node: TreeData) => {
    // 读取文件
    if (node.handle.kind === 'file') {
      const file = await node.handle.getFile();
      setCurrentFile(file);
    } else {
      // 读取子目录
      node.children = await handleDirectoryToArray(node.handle, node);
    }
    setCurrentNode(node);
  };

  // 回显文件夹处理
  const openFolder = async (node: TreeData) => {
    node.children = await handleDirectoryToArray(node.handle as FileSystemDirectoryHandle, node);
    setTreeData([...treeData]);
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

  // 刷新资源管理器
  const handleRefresh = async () => {
    if (!currentGlobalFolder) return;
    const directoryArray = await handleDirectoryToArray(currentGlobalFolder, {
      name: 'TOP',
      type: 'directory',
      handle: currentGlobalFolder,
      parentHandle: currentGlobalFolder,
      parentNode: undefined,
    });
    setTreeData(directoryArray);
    setCurrentFile(undefined);
    setCurrentNode(undefined);
  };

  // 在资源管理器中折叠文件夹
  const handleBatchFolding = async () => {
    if (!currentGlobalFolder) return;
    setChooseStatus(false);
    const directoryArray = await handleDirectoryToArray(currentGlobalFolder, {
      name: 'TOP',
      type: 'directory',
      handle: currentGlobalFolder,
      parentHandle: currentGlobalFolder,
      parentNode: undefined,
    });
    setTreeData(directoryArray);
    setCurrentFile(undefined);
    setCurrentNode(undefined);
    setChooseStatus(true);
  };

  // 修改文件、文件夹
  const handleUpdateFileOrFolder = async (handleNode: TreeData, newName: string) => {
    // 取到父级
    const parentNode = handleNode.parentNode,
      parentHandle = handleNode.parentHandle,
      handle = handleNode.handle,
      oldName = handleNode.name;
    const handleArr = handleNode.parentNode?.children || treeData;
    setLoading(true);
    if (handle.kind === 'file') {
      await renameFile(parentHandle, oldName, newName);
    } else {
      await renameDirectory(parentHandle, oldName, newName);
    }
    const arr = await handleDirectoryToArray(parentHandle, parentNode?.parentNode || parentNode);
    handleArr!.length = 0;
    handleArr!.push(...arr);
    setTreeData([...treeData]);
    setCurrentFile(undefined);
    setCurrentNode(undefined);
    setLoading(false);
  };

  // 删除文件、文件夹
  const deleteFileOrFolder = async (node: TreeData, name: string) => {
    console.log(node, name);
    setLoading(true);
    const handle = node.parentHandle;
    await handle.removeEntry(name, {recursive: true});
    const handleArr = node.parentNode?.children || treeData;
    const arr = handleArr.filter((item) => item.name !== name);
    handleArr!.length = 0;
    handleArr.push(...arr);
    setTreeData([...treeData]);
    setCurrentFile(undefined);
    setCurrentNode(undefined);
    setLoading(false);
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
      <FileContext.Provider value={{currentFile, currentNode, handleSetCurrentNode, handleHiddenFileEdit, handleHiddenDirectoryEdit, handleUpdateFileOrFolder, openFolder, deleteFileOrFolder}}>
        <Obsidian>
          <div className="left">
            <div className="tabBar">
              <div className="title">{currentGlobalFolder?.name}</div>
              <div className="icon" onClick={handleAddFileEdit}>
                <img src={fileAdd} title="新增文件" />
              </div>
              <div className="icon" onClick={handleAddDirectoryEdit}>
                <img src={folderAdd} title="新增文件夹" />
              </div>
              <div className="icon" onClick={handleRefresh}>
                <img src={refresh} title="刷新资源管理器" />
              </div>
              <div className="icon" onClick={handleBatchFolding}>
                <img src={batchFolding} title="在资源管理器中折叠文件夹" />
              </div>
            </div>
            <div className={`tree ${loading ? 'modal-overlay' : ''}`} onClick={handleTreePanelClick}>
              {loading ? <div className="loader"></div> : null}
              {chooseStatus ? <FileTree treeData={treeData} /> : <img className="none" src={addStatus} onClick={selectDirectory} />}
            </div>
          </div>
          <div className="right">
            <FileDetail file={currentFile} chooseStatus={chooseStatus} />
          </div>
        </Obsidian>
      </FileContext.Provider>
    </>
  );
}

export default App;
