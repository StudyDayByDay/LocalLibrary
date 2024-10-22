import ReactDOM from 'react-dom';
import styled from 'styled-components';

const ModalBox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45); /* 背景半透明黑色 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .modal-content {
    width: 520px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 模拟AntDesign的阴影效果 */
    animation: modal-fade-in 0.3s ease-out; /* 模态框淡入动画 */
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 500;
      background-color: #fff;
      .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.45);
        transition: color 0.3s ease;
        &:hover {
          color: rgba(0, 0, 0, 0.75);
        }
      }
    }
    .modal-body {
      padding: 0 24px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
    }
    .modal-buttons {
      padding: 10px 16px;
      text-align: right;
      /* border-top: 1px solid #f0f0f0; */
      background-color: #fff;
      button {
        margin-left: 8px;
        padding: 8px 15px;
        font-size: 14px;
        border-radius: 6px;
        border: 1px solid transparent;
        cursor: pointer;
        transition: background-color 0.3s ease;
        &:first-child {
          background-color: #fff;
          /* color: rgba(0, 0, 0, 0.65); */
          border: 1px solid #d9d9d9;
        }
        &:first-child:hover {
          background-color: #f5f5f5;
        }
        &:last-child {
          background-color: #1e5cca;
          color: #fff;
          border: none;
        }
        &:last-child:hover {
          background-color: #1677ff;
        }
      }
    }
  }

  @keyframes modal-fade-in {
    from {
      opacity: 0;
      transform: scale(0.9); /* 初始缩放 */
    }
    to {
      opacity: 1;
      transform: scale(1); /* 最终正常大小 */
    }
  }
`;

// 定义 Modal 组件的 props 类型
interface ModalProps {
  message: string;
  title?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalComponent: React.FC<ModalProps> = ({message, title = '提示', onConfirm, onCancel}) => {
  return ReactDOM.createPortal(
    <ModalBox>
      <div className="modal-content">
        <div className="modal-header">
          <span>{title}</span>
          <button className="modal-close" onClick={onCancel}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-buttons">
          <button onClick={onCancel}>取消</button>
          <button onClick={onConfirm}>确定</button>
        </div>
      </div>
    </ModalBox>,
    document.body
  );
};

export default ModalComponent;
