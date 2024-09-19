import {createContext} from 'react';
import type {FC} from '@/types/fileTree';

const FileContext = createContext<FC>({
  // 当前文件
  currentFile: undefined,
  // 当前选中的节点
  currentNode: undefined,
  handleSetCurrentNode() {},
});

export default FileContext;
