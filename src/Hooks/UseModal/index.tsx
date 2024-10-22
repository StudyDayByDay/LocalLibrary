import ModalComponent from '@/components/Modal';
import {useState} from 'react';

// 定义 useModal Hook 返回值类型
interface UseModalReturn {
  showModal: (message: string, title?: string) => Promise<void>;
  Modal: React.FC;
}

interface PromiseHandle {
  resolvePromise: () => void;
  rejectPromise: () => void;
}

const useModal = (): UseModalReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [promiseHandle, setPromiseHandle] = useState<PromiseHandle>();

  const showModal = (message: string, title = '提示'): Promise<void> => {
    setModalMessage(message);
    setModalTitle(title);
    setIsVisible(true);

    return new Promise<void>((resolve, reject) => {
      setPromiseHandle({
        resolvePromise: resolve,
        rejectPromise: reject,
      });
    });
  };

  const handleConfirm = () => {
    setIsVisible(false);
    promiseHandle?.resolvePromise(); // 触发 Promise 的 resolve
  };

  const handleCancel = () => {
    setIsVisible(false);
    promiseHandle?.rejectPromise(); // 触发 Promise 的 reject
  };

  const Modal: React.FC = () => isVisible && <ModalComponent message={modalMessage} title={modalTitle} onConfirm={handleConfirm} onCancel={handleCancel} />;

  return {showModal, Modal};
};

export default useModal;
