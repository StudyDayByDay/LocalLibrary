import TreeNode from './components/TreeNode';
import type {TreeData} from '@/types/fileTree';

export default function FileTree({treeData}: {treeData: TreeData[]}) {
  const handleLastParent = (index: number, arr: TreeData[]) => {
    const length = arr.length - 1;

    if (index === length) {
      return 'lastParent';
    }

    if (arr[index].children && !arr[index + 1].children) {
      return 'lastParent';
    }

    return '';
  };
  return (
    <div className="tree-panel">
      {treeData.map((item, ind) => (
        <TreeNode key={ind} node={item} dataType="" nodeType={handleLastParent(ind, treeData)} />
      ))}
    </div>
  );
}
