import {useState} from 'react';
import styled from 'styled-components';
import folder from '@/assets/svg/file-folder.svg';
import folderOpen from '@/assets/svg/file-folder-open.svg';
import SvgIcon from '../SvgIcon';
import type {Props} from '@/types/fileTree';

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

  const handleChange = () => {
    setShowChild(!showChild);
  };
  return (
    // data-type='node'表示是被渲染的子集，最左边需要加边框
    // node-type='lastParent'表示是最后的父级，需要去除父级边框
    <TreeNodeBox data-type={dataType} node-type={nodeType}>
      <div className="tree-title">
        <div className="tree-title-content">
          <div className="line"></div>
          <div className="content" onClick={handleChange}>
            {node.children ? <img src={showChild ? folderOpen : folder} /> : <SvgIcon fileName={node.name} />}
            <span className="text">{node.name}</span>
          </div>
        </div>
      </div>
      {node.children && showChild ? (
        <div className="tree-content">
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
