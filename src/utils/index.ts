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
