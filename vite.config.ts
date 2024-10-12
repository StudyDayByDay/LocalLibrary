import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  // 加载对应环境的 .env 文件
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      react(),
      monacoEditorPlugin.default({
        languageWorkers: ['editorWorkerService', 'typescript', 'css', 'html', 'json'], // 选择你需要的语言支持
      }),
    ],
    base: env.VITE_BASE_URL,
    server: {
      host: true,
      open: true,
    },
  };
});
