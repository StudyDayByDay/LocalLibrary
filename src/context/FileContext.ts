import {createContext} from 'react';
import type {FC} from '@/types/fileTree';

const FileContext = createContext<FC>({
  currentFile: undefined,
  fileHandle: undefined,
  getFile() {},
});

export default FileContext;
