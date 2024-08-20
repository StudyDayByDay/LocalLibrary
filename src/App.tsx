import styled from 'styled-components';
import add from './assets/add.svg';
import edit from './assets/edit.svg';

const Obsidian = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto;
  column-gap: 20px;
  padding: 20px;
  .left {
    display: flex;
    flex-direction: column;
    /* background-color: pink; */
    .tabBar {
      padding: 10px 20px;
      border: 1px solid #ccc;
      border-radius: 25px;
    }
    .tree {
      flex: 1;
      padding: 20px;
      margin-top: 20px;
      border: 1px solid #ccc;
      border-radius: 25px;
    }
  }
  .right {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 25px;
  }
`;

function App() {
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
      <Obsidian>
        <div className="left">
          <div className="tabBar">
            <img src={add} title="新增文件" />
            <img src={edit} title="新增文件" />
          </div>
          <div className="tree">文件树</div>
        </div>
        <div className="right">文件详情</div>
      </Obsidian>
    </>
  );
}

export default App;
