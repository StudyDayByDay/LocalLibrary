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
  const {fileHandle} = useContext(FileContext);

  const saveFile = async (editor: monaco.editor.IStandaloneCodeEditor) => {
    const code = editor.getValue();
    const writeableStream = await fileHandle?.createWritable();
    console.log(code);
    await writeableStream?.write(code);
    await writeableStream?.close();
    alert('保存成功');
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

    // editor.onDidChangeModelContent((event) => {
    //   console.log('Content changed:');
    // });

    editorRef.current?.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // 阻止浏览器的默认保存行为
        // 执行保存操作
        saveFile(editor);
      }
    });

    return () => {
      editor.dispose();
    };
  }, [value, language]);

  return <EditorBox ref={editorRef}></EditorBox>;
}
