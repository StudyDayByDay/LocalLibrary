import {useRef, useEffect, useContext, useState} from 'react';
import * as monaco from 'monaco-editor';
import styled from 'styled-components';
import FileContext from '@/context/FileContext';
import {marked} from 'marked';
import rehypeHighlight from 'rehype-highlight';
import {rehype} from 'rehype';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';

const EditorBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  .code-box {
    flex: 1;
    height: 100%;
  }
  .preview-box {
    width: 50%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    word-wrap: break-word;
    word-break: break-all;

    * {
      white-space: pre-wrap;
      word-wrap: break-word;
      /* overflow-x: auto; */
    }

    pre {
      overflow-x: auto;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }
`;

export default function Editor({value, language}: {value: string; language: string}) {
  const monacoEditorInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const {currentNode} = useContext(FileContext);
  const [mdToHtml, setMdToHtml] = useState('');
  const isSyncingEditorScroll = useRef(false);
  const isSyncingPreviewScroll = useRef(false);

  const saveFile = async (editor: monaco.editor.IStandaloneCodeEditor) => {
    const code = editor.getValue();
    const handle = currentNode?.handle as FileSystemFileHandle;
    const writeableStream = await handle.createWritable();
    await writeableStream?.write(code);
    await writeableStream?.close();
  };

  const handleMarkdown = async (editor: monaco.editor.IStandaloneCodeEditor) => {
    if (language !== 'markdown') return;
    const code = editor.getValue();
    const md = await marked(code);
    rehype()
      .data('settings', {fragment: true})
      .use(rehypeHighlight)
      .process(md)
      .then((file) => {
        setMdToHtml(String(file));
      });
  };

  // 监听右侧预览框的滚动事件，同步左侧编辑器
  const handlePreviewScroll = () => {
    if (isSyncingEditorScroll.current) return; // 避免双向循环触发

    isSyncingPreviewScroll.current = true;
    const preview = previewRef.current;
    const editor = monacoEditorInstance.current;
    if (editor && preview) {
      const scrollTop = preview.scrollTop;
      const scrollHeight = preview.scrollHeight;
      const clientHeight = preview.clientHeight;

      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
      const editorScrollHeight = editor.getScrollHeight();
      const editorClientHeight = editor.getDomNode()?.clientHeight || 1;

      editor.setScrollTop(scrollPercentage * (editorScrollHeight - editorClientHeight));
    }
    isSyncingPreviewScroll.current = false;
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

    monacoEditorInstance.current = editor;
    // 编辑器内容变化
    editor.onDidChangeModelContent(() => {
      handleMarkdown(editor);
      saveFile(editor);
    });

    // 监听编辑器滚动变化
    editor.onDidScrollChange(() => {
      if (isSyncingPreviewScroll.current) return;
      isSyncingEditorScroll.current = true;
      const preview = previewRef.current;
      if (preview) {
        const scrollTop = editor.getScrollTop(); // 获取当前滚动条位置
        const scrollHeight = editor.getScrollHeight(); // 获取内容的总高度
        const clientHeight = editor.getDomNode()?.clientHeight || 1; // 可视区域高度

        const scrollPercentage = scrollTop / (scrollHeight - clientHeight); // 计算滚动百分比
        preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight); // 同步预览滚动
      }
      isSyncingEditorScroll.current = false;
    });

    handleMarkdown(editor);
    return () => {
      editor.dispose();
    };
  }, [value, language]);

  return (
    <EditorBox>
      <div ref={editorRef} className="code-box"></div>
      {language === 'markdown' && <div ref={previewRef} className="preview-box markdown-body" onScroll={handlePreviewScroll} dangerouslySetInnerHTML={{__html: mdToHtml}}></div>}
    </EditorBox>
  );
}
