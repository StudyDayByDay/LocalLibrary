import type {TreeData, TreeNodeType} from '@/types/fileTree';

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

export function getEditorTypeByFileSuffix(fileName: string) {
  const arr = fileName.split('.');
  const suffix = arr[arr.length - 1];
  const fileExtensionsToLanguages: {
    [key: string]: string;
  } = {
    abap: 'abap',
    apex: 'apex',
    azcli: 'azcli',
    bat: 'bat', // Batch script (.bat)
    bicep: 'bicep',
    c: 'c',
    mligo: 'cameligo',
    clj: 'clojure',
    coffee: 'coffee',
    cpp: 'cpp', // C++ (.cpp)
    cs: 'csharp', // C# (.cs)
    csp: 'csp',
    css: 'css',
    dart: 'dart',
    dockerfile: 'dockerfile', // Dockerfile
    ecl: 'ecl',
    ex: 'elixir',
    exs: 'elixir',
    erl: 'erlang',
    flow: 'flow',
    fs: 'fsharp', // F# (.fs, .fsi)
    fsi: 'fsharp',
    go: 'go',
    graphql: 'graphql', // GraphQL (.graphql, .gql)
    gql: 'graphql',
    hbs: 'handlebars', // Handlebars (.hbs)
    handlebars: 'handlebars',
    hcl: 'hcl',
    html: 'html',
    htm: 'html', // HTML (.html, .htm)
    ini: 'ini',
    java: 'java',
    js: 'javascript', // JavaScript (.js, .mjs)
    mjs: 'javascript',
    json: 'json',
    jl: 'julia', // Julia (.jl)
    kt: 'kotlin', // Kotlin (.kt, .kts)
    kts: 'kotlin',
    less: 'less',
    lex: 'lexon',
    lua: 'lua',
    md: 'markdown', // Markdown (.md)
    s: 'mips', // MIPS (.s, .asm)
    asm: 'mips',
    dax: 'msdax',
    sql: 'mysql', // MySQL (.sql), also used for PostgreSQL, Redshift, etc.
    m: 'objectivec', // Objective-C (.m)
    mm: 'objectivec',
    pas: 'pascal', // Pascal (.pas, .pp)
    pp: 'pascal',
    pl: 'perl', // Perl (.pl, .pm)
    pm: 'perl',
    cshtml: 'razor', // Razor (.cshtml)
    redis: 'redis',
    rst: 'restructuredtext', // reStructuredText (.rst)
    rb: 'ruby', // Ruby (.rb)
    rs: 'rust', // Rust (.rs)
    sb: 'sb',
    scala: 'scala',
    scm: 'scheme', // Scheme (.scm)
    scss: 'scss',
    sh: 'shell', // Shell (.sh, .bash, .zsh)
    bash: 'shell',
    zsh: 'shell',
    sol: 'solidity', // Solidity (.sol)
    aes: 'sophia',
    rq: 'sparql', // SPARQL (.rq, .sparql)
    sparql: 'sparql',
    st: 'st',
    swift: 'swift', // Swift (.swift)
    sv: 'systemverilog', // SystemVerilog (.sv, .svh)
    svh: 'systemverilog',
    tcl: 'tcl',
    twig: 'twig', // Twig (.twig)
    ts: 'typescript', // TypeScript (.ts, .tsx)
    tsx: 'typescript',
    vb: 'vb',
    xml: 'xml', // XML (.xml)
    yaml: 'yaml', // YAML (.yaml, .yml)
    yml: 'yaml',
  };
  return suffix in fileExtensionsToLanguages ? fileExtensionsToLanguages[suffix] : 'txt';
}

export async function handleDirectoryToArray(dirHandle: FileSystemDirectoryHandle, parentNode?: TreeData) {
  console.log(dirHandle, 'dirHandle');
  const result = [];
  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'directory') {
      const subDirHandle = await dirHandle.getDirectoryHandle(entry.name);
      result.push({
        name: entry.name,
        type: 'directory' as TreeNodeType,
        children: [],
        handle: subDirHandle,
        parentHandle: dirHandle,
        parentNode,
      });
    } else if (entry.kind === 'file') {
      result.push({
        name: entry.name,
        type: 'file' as TreeNodeType,
        handle: entry,
        parentHandle: dirHandle,
        parentNode,
      });
    }
  }
  handleSortFiles(result);
  return result;
}

// 图片文件后缀名
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'svg', 'webp', 'ico', 'heic', 'heif'];

// 视频文件后缀名
const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'mkv', 'flv', 'webm', '3gp', 'm4v'];

// 办公文档文件后缀名
const documentExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'];

export function getSuffix(fileName: string) {
  const arr = fileName.split('.');
  return arr[arr.length - 1];
}

export function isMediaFile(fileName: string) {
  // 合并所有文件后缀名
  const suffix = getSuffix(fileName);
  const allExtensions = [...imageExtensions, ...videoExtensions, ...documentExtensions];
  return allExtensions.includes(suffix);
}

export function getMediaType(fileName: string) {
  let type = 'none';
  const suffix = getSuffix(fileName);
  if (imageExtensions.includes(suffix)) {
    type = 'image';
  }
  if (videoExtensions.includes(suffix)) {
    type = 'video';
  }
  if (documentExtensions.includes(suffix)) {
    type = 'document';
  }
  return type;
}

export async function renameFile(directoryHandle: FileSystemDirectoryHandle, oldFileName: string, newFileName: string): Promise<void> {
  // 获取旧文件的 FileSystemFileHandle
  const oldFileHandle = await directoryHandle.getFileHandle(oldFileName);

  // 读取旧文件内容
  const oldFile = await oldFileHandle.getFile();
  const oldFileContent = await oldFile.arrayBuffer();

  // 创建新文件并写入旧文件内容
  const newFileHandle = await directoryHandle.getFileHandle(newFileName, {create: true});
  const writable = await newFileHandle.createWritable();
  await writable.write(oldFileContent);
  await writable.close();

  // 删除旧文件
  await directoryHandle.removeEntry(oldFileName);
}

export async function renameDirectory(parentDirectoryHandle: FileSystemDirectoryHandle, oldDirectoryName: string, newDirectoryName: string): Promise<void> {
  try {
    // 获取旧文件夹的 FileSystemDirectoryHandle
    const oldDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(oldDirectoryName);

    // 创建新的文件夹
    const newDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(newDirectoryName, {create: true});

    // 递归复制文件夹内容并等待完成
    await copyDirectoryContents(oldDirectoryHandle, newDirectoryHandle);

    // 删除旧文件夹
    await parentDirectoryHandle.removeEntry(oldDirectoryName, {recursive: true});

    // 返回操作完成的 Promise
    console.log('All operations completed successfully.');
  } catch (error) {
    console.error(`Failed to rename directory: ${error}`);
    throw error; // 将错误抛出，返回 rejected promise
  }
}

async function copyDirectoryContents(oldDirectoryHandle: FileSystemDirectoryHandle, newDirectoryHandle: FileSystemDirectoryHandle): Promise<void> {
  // 创建一个任务数组来存储所有的复制操作
  const tasks: Promise<void>[] = [];

  // 遍历旧文件夹中的所有文件和子文件夹
  for await (const [name, handle] of oldDirectoryHandle) {
    const task = (async () => {
      try {
        if (handle.kind === 'file') {
          // 处理文件复制
          const file = await handle.getFile();
          const newFileHandle = await newDirectoryHandle.getFileHandle(name, {create: true});
          const writable = await newFileHandle.createWritable();
          await writable.write(await file.arrayBuffer());
          await writable.close();
        } else if (handle.kind === 'directory') {
          // 处理子文件夹复制
          const newSubDirectoryHandle = await newDirectoryHandle.getDirectoryHandle(name, {create: true});
          // 递归处理子文件夹并等待其完成
          await copyDirectoryContents(handle, newSubDirectoryHandle);
        }
      } catch (error) {
        console.error(`Failed to copy entry: ${name}. Error: ${error}`);
        throw error; // 如果出错，抛出错误
      }
    })();

    // 将该任务添加到任务数组中
    tasks.push(task);
  }

  // 等待所有任务完成
  await Promise.all(tasks);
}
