export type TreeNodeType = 'file' | 'directory' | 'fileEdit' | 'directoryEdit';
export interface TreeData {
  name: string;
  type: TreeNodeType;
  handle: FileSystemFileHandle | FileSystemDirectoryHandle;
  children?: TreeData[];
  parentHandle: FileSystemDirectoryHandle;
  parentNode?: TreeData;
}

export type handleSetCurrentNode = (currentNode: TreeData) => void;
export type handleHiddenFileEdit = (value: string) => void;
export type handleHiddenDirectoryEdit = (value: string) => void;
export type handleUpdateFileOrFolder = (handleNode: TreeData, newName: string) => void;

export interface Props {
  node: TreeData;
  dataType: string;
  nodeType: string;
}

export interface FC {
  currentFile?: File;
  currentNode?: TreeData;
  handleSetCurrentNode: handleSetCurrentNode;
  handleHiddenFileEdit: handleHiddenFileEdit;
  handleHiddenDirectoryEdit: handleHiddenDirectoryEdit;
  handleUpdateFileOrFolder: handleUpdateFileOrFolder;
}
