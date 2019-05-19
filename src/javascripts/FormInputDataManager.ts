import * as $ from 'jquery';
import * as CryptoJS from 'crypto-js';

const DEFAULT_KEY_PREFIX = '__forminputrecover';
const DEFAULT_EXPIRE_HOUR = 2;
const DEFAULT_PASSWORD = 'password_forminputrecover';

export enum ErrorType {
  // 暗号化に失敗
  ERROR_DATA_ENCRYPT = 'ERROR_DATA_ENCRYPT',
  // 暗号パスワードが違う
  ERROR_INCORRECT_PASSWORD = 'ERROR_INCORRECT_PASSWORD',
  // データが存在しない
  ERROR_DATA_NOT_FOUND = 'ERROR_DATA_NOT_FOUND',
  // データの有効期限切れ
  ERROR_DATA_EXPIRED = 'ERROR_DATA_EXPIRED',
}

export default class FormInputDataManager {
  private keyPrefix = '';
  private keyName = '';
  private formElement: JQuery<HTMLElement>;
  private storedFormData = {};
  private editingFormData = {};
  private expiredHour = 0;
  private password = '';
  private lastSavedAt: number = 0;

  init(props: {
    formId?: string,
    keyPrefix?: string,
    expiredHour?: number,
    password?: string,
  }): boolean {

    // フォーム情報取得
    if ($('form').length <= 0) return false;
    const formElement = props.formId ? $(`#${props.formId}`) : $('form').first();
    if (formElement.length <= 0 || !formElement) return false;
    this.formElement = formElement;

    // 保存有効期限
    this.expiredHour = props.expiredHour ? props.expiredHour : DEFAULT_EXPIRE_HOUR;
    // パスワード
    this.password = props.password ? props.password : DEFAULT_PASSWORD;
    // 最終保存時間
    this.lastSavedAt = new Date().getTime();

    // localstorageに保存するためのキーを準備
    // {ライブラリプリフィックス}_{ページのパス}_{フォームID}
    console.log('pathname', location.pathname);
    this.keyPrefix = props.keyPrefix ? props.keyPrefix : DEFAULT_KEY_PREFIX;
    if (props.formId) {
      this.keyName = `${this.keyPrefix}_${encodeURIComponent(location.pathname)}_${props.formId}`;
    } else {
      this.keyName = `${this.keyPrefix}_${encodeURIComponent(location.pathname)}_default`;
    }

    // 保存されているフォーム入力データを取得
    const localData = this.loadData();
    if (localData.error === ErrorType.ERROR_DATA_NOT_FOUND || !localData.data) {
      this.storedFormData = {};
    } else {
      this.storedFormData = localData.data;
    }
    // this.editingFormData = Object.assign({}, this.storedFormData);
    this.editingFormData = {};

    this.beginObserve();

    return true;
  }

  private beginObserve = () => {
    // フォーム内のinput, textarea, select要素の更新イベントを監視して変数に記録
    // 自動保存モードの場合はさらにlocalstorageにも記録する
    $(this.formElement).find('input,select').change((e) => {
      const target: Element = e.target;
      if (!target) return;

      this.updateLocalData(target);

      console.log('change 自動保存実行');
      this.lastSavedAt = new Date().getTime();
      this.saveData();
    });

    $(this.formElement).find('input,textarea').keyup((e) => {
      const target: Element = e.target;
      if (!target) return;

      this.updateLocalData(target);

      // 自動的に記録するが高頻度の場合負荷が高いのでインターバルを1秒設ける
      const current = new Date().getTime();
      if ((current - this.lastSavedAt) > 1000) {
        console.log('keyup 自動保存実行');
        this.lastSavedAt = current;
        this.saveData();
      }
    });
  }

  private updateLocalData(target: Element) {
    const type = target['type'];
    const name = target['name'];
    const tmpValue = target['value'];
    // console.log(type, name, tmpValue);

    // パスワードは保存しない
    if (!type || !name || type === 'password') return;

    // チェックボックスは文字列の配列で持たせる
    let value = tmpValue;
    if (type === 'checkbox' && this.editingFormData[name]) {
      let checkboxValues = this.editingFormData[name].value;
      if ((typeof checkboxValues) === 'string') {
        checkboxValues = [checkboxValues];
      }

      if (target['checked']) {
        checkboxValues.push(value);
      } else {
        checkboxValues.some((v, i) => {
          if (v === value) checkboxValues.splice(i, 1);
        });
      }
      value = checkboxValues;
    }
    // select-multipleの場合はoption情報から取得
    if (type === 'select-multiple') {
      const options: HTMLOptionsCollection = target['options'];
      if (options) {
        value = [];
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          if (opt.selected) {
            value.push(opt.value || opt.text);
          }
        }
      }
      console.log('select', value);
    }

    this.editingFormData[name] = {
      type, value,
    };
  }

  private loadData = () => {
    const localData = localStorage.getItem(this.keyName);
    if (!localData) return { error: ErrorType.ERROR_DATA_NOT_FOUND };
    let formDataStr = localData;

    // descrypt
    try {
      console.log('before decrypt', localData);
      const decryptStr = CryptoJS.AES.decrypt(formDataStr, this.password);
      console.log('after decrypt1', decryptStr);
      formDataStr = decryptStr.toString(CryptoJS.enc.Utf8);
      if (!formDataStr) {
        return { error: ErrorType.ERROR_INCORRECT_PASSWORD };
      }
      console.log('after decrypt2', formDataStr);
    } catch (e) {
      console.log('error at decrypt', e, formDataStr);
      return { error: ErrorType.ERROR_INCORRECT_PASSWORD };
    }

    // JSONパースする
    let formData = { savedAt: 0, data: {} };
    try {
      formData = JSON.parse(formDataStr);
    } catch (e) {
      console.log('fail parse', e);
      return { error: ErrorType.ERROR_DATA_NOT_FOUND };
    }

    // 保存日時が(現在時刻 - 有効期限)よりも過去の場合何もしない
    if (!formData.savedAt || this.isExpired(formData.savedAt)) {
      console.log('stored data expierd', formData);
      return { error: ErrorType.ERROR_DATA_EXPIRED };
    }

    if (!formData.data) {
      return { error: ErrorType.ERROR_DATA_NOT_FOUND };
    }

    console.log('success loadData.');
    return { data: formData.data };
  }

  private isExpired(savedAt: number) {
    // 有効期限の確認
    const current = new Date().getTime();
    const expiredAt = current - (this.expiredHour * 1000 * 60 * 60);
    console.log('check expierd.', this.expiredHour, expiredAt, savedAt);

    return savedAt < expiredAt;
  }

  saveData = () => {
    const savedAt = new Date().getTime();
    let formDataStr = JSON.stringify({
      savedAt, data: this.editingFormData,
    });

    // encrypt
    try {
      // 暗号化
      const encryptedData = CryptoJS.AES.encrypt(formDataStr, this.password);
      // console.log('after encrypt', encryptedData.toString());
      formDataStr = encryptedData.toString();
    } catch (e) {
      // console.log('error at encrypt', formDataStr, e);
      return { error: ErrorType.ERROR_DATA_ENCRYPT };
    }

    // localstorageに保存
    localStorage.setItem(this.keyName, formDataStr);

    return {};
  }

  destroyData = () => {
    localStorage.removeItem(this.keyName);
    this.storedFormData = {};
  }

  hasStoredData = () => {
    return Object.keys(this.storedFormData).length >= 1;
  }

  recoverData = () => {
    const recoverData = this.storedFormData;

    // jQueryを使って値をセット
    Object.keys(recoverData).forEach((name) => {
      const attrs = recoverData[name];
      if (attrs.type === 'password') {
        // パスワード項目に対しては何もしない
      } else if (attrs.type === 'textarea') {
        $(this.formElement).find(`textarea[name="${name}"]`).val(attrs.value);
      } else if (attrs.type === 'select-one') {
        $(this.formElement).find(`select[name="${name}"]`).val(attrs.value);
      } else if (attrs.type === 'select-multiple') {
        $(this.formElement).find(`select[name="${name}"]`).val(attrs.value);
      } else if (attrs.type === 'radio') {
        $(this.formElement).find(`input[name="${name}"][value="${attrs.value}"]`).attr('checked', 'true');
      } else if (attrs.type === 'checkbox') {
        if ((typeof attrs.value) === 'string') {
          $(this.formElement).find(`input[name="${name}"][value="${attrs.value}"]`).attr('checked', 'true');
        } else {
          attrs.value.forEach((v) => {
            $(this.formElement).find(`input[name="${name}"][value="${v}"]`).attr('checked', 'true');
          });
        }
      } else {
        $(this.formElement).find(`input[name="${name}"]`).val(attrs.value);
      }
    });

    this.editingFormData = Object.assign({}, this.storedFormData, this.editingFormData);
  }

}
