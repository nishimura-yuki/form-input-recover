import { createInstance, Props } from './FormInputRecover';
import ConfirmModal from '../view/ConfirmModal';

export type ViewProps = {
  elementId: string;
  zIndex?: number;
};

export const executeInputRecover = (props: Props, viewProps?: ViewProps) => {
  const instance = createInstance(props);
  if (instance === null) return;

  if (viewProps) {
    if (instance.hasStoredData()) {
      const { elementId, zIndex } = viewProps;
      const confirmModal = ConfirmModal(zIndex);
      let elm: (HTMLElement | null) = document.getElementById(elementId);

      if (elm) {
        elm.innerHTML = confirmModal;
      } else {
        // 指定したID要素が取得できなかった場合はbodyにappend
        elm = document.createElement('div');
        elm.innerHTML = confirmModal;
        document.body.appendChild(elm);
      }

      // 復元,削除,閉じるイベントを追加
      const recoverButton = elm.getElementsByClassName('buttonRecover');
      const destroyButton = elm.getElementsByClassName('buttonDestroy');
      const closeButton = elm.getElementsByClassName('buttonClose');
      if (recoverButton && recoverButton.length > 0) {
        recoverButton[0].addEventListener('click', () => {
          instance.recoverData();
        });
      }
      if (destroyButton && destroyButton.length > 0) {
        destroyButton[0].addEventListener('click', () => {
          instance.destroyData();
        });
      }
      if (closeButton && closeButton.length > 0) {
        closeButton[0].addEventListener('click', () => {
          if (elm) {
            elm.style.display = 'none';
          }
        });
      }
    }

  } else {
    // 自動復元の場合はこれだけ
    if (instance.hasStoredData()) {
      instance.recoverData();
    }
  }

  // サブミットイベント発生時にデータ削除

};
