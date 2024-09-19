import {useRef, useEffect, useContext} from 'react';
import * as monaco from 'monaco-editor';
import styled from 'styled-components';
import FileContext from '@/context/FileContext';

const EditorBox = styled.div`
  width: 100%;
  height: 100%;
`;

export default function Editor({value, language}: {value: string; language: string}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const {currentNode} = useContext(FileContext);

  const saveFile = async (editor: monaco.editor.IStandaloneCodeEditor) => {
    const code = editor.getValue();
    const handle = currentNode?.handle as FileSystemFileHandle;
    const writeableStream = await handle.createWritable();
    await writeableStream?.write(code);
    await writeableStream?.close();
  };

  useEffect(() => {
    const editor = monaco.editor.create(editorRef.current as HTMLDivElement, {
      value,
      language,
      theme: 'vs',
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React, // 支持 JSX 语法
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs, // Node.js 的模块解析
      allowSyntheticDefaultImports: true, // 支持默认导入
      esModuleInterop: true, // 兼容 CommonJS 模块
      target: monaco.languages.typescript.ScriptTarget.ESNext, // 编译到最新的 ES 版本
      baseUrl: './', // 设置项目的基础路径
      paths: {
        '@/*': ['src/*'],
      },
    });

    editor.onDidChangeModelContent(() => {
      saveFile(editor);
    });
    return () => {
      editor.dispose();
    };
  }, [value, language]);

  return <EditorBox ref={editorRef}></EditorBox>;
}
