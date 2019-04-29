
// LocalStorageが利用できるかどうかを確認するメソッド
export const isSupportStorage = () => {
  if (('localStorage' in window) && window['localStorage'] !== null) {
    const test = '__form-input-recover_confirm_flag';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
};
