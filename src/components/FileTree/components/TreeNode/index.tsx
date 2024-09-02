import {useState} from 'react';
import styled from 'styled-components';
import treeMinus from '@/assets/images/tree-minus.png';
import treeAdd from '@/assets/images/tree-add.png';

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
        transform: translateY(4px);
        margin-top: 10px;
        img {
          width: 11px;
          height: 11px;
          cursor: pointer;
          transform: translateX(-4px);
        }
        .text {
          margin-left: 8px;
          cursor: pointer;
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

interface TreeData {
  name: string;
  type: string;
  children?: TreeData[];
}

interface Props {
  node: TreeData;
  dataType: string;
  nodeType: string;
}

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
          <div className="content">
            {node.children ? <img src={showChild ? treeMinus : treeAdd} onClick={handleChange} /> : null}
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
