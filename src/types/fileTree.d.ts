export interface TreeData {
  name: string;
  type: string;
  fileHandle?: FileSystemFileHandle;
  children?: TreeData[];
}

export type getFile = (fileHandle: FileSystemFileHandle) => void;

export interface Props {
  node: TreeData;
  dataType: string;
  nodeType: string;
  getFile: getFile;
}
