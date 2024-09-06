export interface TreeData {
  name: string;
  type: string;
  children?: TreeData[];
}

export interface Props {
  node: TreeData;
  dataType: string;
  nodeType: string;
}
