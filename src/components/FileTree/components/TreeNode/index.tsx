import {useContext, useState, useRef, useEffect} from 'react';
import styled from 'styled-components';
import folder from '@/assets/svg/file-folder.svg';
import folderOpen from '@/assets/svg/file-folder-open.svg';
import SvgIcon from '../SvgIcon';
import type {Props} from '@/types/fileTree';
import FileContext from '@/context/FileContext';

const TreeNodeBox = styled.div`
  &[data-type='node'] {
    .tree-title {
      border-left: 1px dotted #ccc;
      &-content {
        .line {
          display: block;
          width: 35px;
          height: 35px;
          border-bottom: 1px dotted #ccc;
        }
      }
    }
  }
  &[node-type='lastParent'] {
    /* > .tree-title {
      margin-bottom: 5px;
    } */
    > .tree-content {
      > .nodes {
        border: 0;
      }
    }
  }
  .tree-title {
    &-content {
      display: flex;
      align-items: baseline;
      height: 35px;
      .line {
        display: none;
      }
      .content {
        transform: translateY(8px);
        margin-top: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        width: 100%;
        img {
          width: 22px;
          height: 22px;
          transform: translateX(-8px);
        }
        .text {
          /* margin-left: 4px; */
          user-select: none;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:hover {
            color: rgb(40, 121, 218);
          }
        }
        .selected {
          font-weight: bold;
          color: rgb(40, 121, 218);
        }
      }
    }
  }
  .tree-content {
    /* padding: 0 0 0 5px; */
    .nodes {
      padding: 0 0 0 35px;
      border-left: 1px dotted #ccc;
    }
  }
`;

export default function TreeNode(props: Props) {
  const {node, dataType, nodeType} = props;
  const [showChild, setShowChild] = useState(false);
  const [updateFlag, setUpdateFlag] = useState(false);
  const {currentNode, handleSetCurrentNode, handleHiddenFileEdit, handleHiddenDirectoryEdit} = useContext(FileContext);

  const inputRef = useRef<HTMLInputElement>(null);
  const updateRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const handleClick = async () => {
    handleSetCurrentNode(node);
    setShowChild(!showChild);
    if (divRef.current) {
      divRef.current.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [node.type]);

  useEffect(() => {
    if (updateRef.current) {
      updateRef.current.value = node.name;
      const length = node.name.split('.')[0].length;
      updateRef.current.focus();
      updateRef.current.setSelectionRange(0, length);
    }
  }, [updateFlag]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 处理回车事件
      console.log('回车');
      if (node.children) {
        handleHiddenDirectoryEdit(inputRef.current?.value as string);
      } else {
        handleHiddenFileEdit(inputRef.current?.value as string);
      }
    }
  };

  const handleBlur = () => {
    console.log('失焦');
    if (node.children) {
      handleHiddenDirectoryEdit(inputRef.current?.value as string);
    } else {
      handleHiddenFileEdit(inputRef.current?.value as string);
    }
  };

  const handleUpdate = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      // 聚焦
      setUpdateFlag(true);
    }
  };

  const handleUpdateEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 处理回车事件
      console.log('回车');
    }
  };

  const handleUpdateBlur = () => {
    console.log('失焦');
  };

  return (
    // data-type='node'表示是被渲染的子集，最左边需要加边框
    // node-type='lastParent'表示是最后的父级，需要去除父级边框
    <TreeNodeBox data-type={dataType} node-type={nodeType}>
      <div className="tree-title">
        <div className="tree-title-content">
          <div className="line"></div>
          {node.type === 'fileEdit' || node.type === 'directoryEdit' ? (
            <div className="content">
              {node.children ? <img src={showChild ? folderOpen : folder} /> : <SvgIcon fileName={node.name} />}
              <input type="text" ref={inputRef} onKeyDown={handleEnter} onBlur={handleBlur} />
            </div>
          ) : (
            <div tabIndex={0} className="content" ref={divRef} onClick={handleClick} title={node.name} onKeyDown={handleUpdate}>
              {node.children ? <img src={showChild ? folderOpen : folder} /> : <SvgIcon fileName={node.name} />}
              {updateFlag ? (
                <input type="text" ref={updateRef} onKeyDown={handleUpdateEnter} onBlur={handleUpdateBlur} />
              ) : (
                <span className={node === currentNode ? 'text selected' : 'text'}>{node.name}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {node.children?.length && showChild ? (
        <div className="tree-content ">
          <div className="nodes">
            {node.children.map((ite, i) => (
              <TreeNode dataType="node" key={i} node={ite} nodeType={i === node.children!.length - 1 ? 'lastParent' : ''} />
            ))}
          </div>
        </div>
      ) : null}
    </TreeNodeBox>
  );
}
