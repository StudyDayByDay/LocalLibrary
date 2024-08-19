import {useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const visitFold = async () => {
    const dirHandle = await window.showDirectoryPicker({mode: 'readwrite'});
    console.log(dirHandle);
    const keys = dirHandle.keys();
    console.log(keys);
    for await (const element of keys) {
      console.log(element, 'element');
    }
  };

  const visitFile = async () => {
    const res = await window.showOpenFilePicker();
    console.log(res[0].getFile().then(console.log), 'res');
  };
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <button onClick={visitFold}>点击访问文件夹</button>
      <button onClick={visitFile}>点击访问文件</button>
    </>
  );
}

export default App;
