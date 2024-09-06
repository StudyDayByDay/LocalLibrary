import type {TreeData} from '@/types/fileTree';

// 处理所有文件、文件夹
const handleSortByName = (arr: TreeData[]) => {
  arr.sort((a, b) => {
    if (a.children) {
      handleSortByName(a.children);
    }
    return a.name.localeCompare(b.name);
  });
};

// 提高文件夹权重
const handleIncreaseFolderWeight = (arr: TreeData[]) => {
  arr.sort((a) => {
    if (a.children) {
      handleIncreaseFolderWeight(a.children);
      return -1;
    }
    return 1;
  });
};

// 对文件夹排序
const handleSortByFolderName = (arr: TreeData[]) => {
  arr.sort((a, b) => {
    if (a.children) {
      handleSortByFolderName(a.children);
      if (b.children) {
        return a.name.localeCompare(b.name);
      }
      return -1;
    }
    return 0;
  });
};

export function handleSortFiles(arr: TreeData[]) {
  // 对文件排序
  handleSortByName(arr);
  // 提高文件夹的权重
  handleIncreaseFolderWeight(arr);
  // 对文件夹排序
  handleSortByFolderName(arr);
}
