import FormInputDataManager from './FormInputDataManager';
import { isSupportStorage } from './util';

class FormInputRecover {
  dataManager: FormInputDataManager[] = [];

  constructor(props: Props) {
    if (props.formId && Array.isArray(props.formId)) {
      props.formId.forEach((id) => {
        const manager = new FormInputDataManager();
        manager.init({
          formId: id,
          keyPrefix: props.keyPrefix,
          expiredHour: props.expiredHour,
          password: props.password,
        });
        this.dataManager.push(manager);
      });
    } else {
      this.dataManager.push(new FormInputDataManager());
      this.dataManager[0].init({
        formId: props.formId,
        keyPrefix: props.keyPrefix,
        expiredHour: props.expiredHour,
        password: props.password,
      });
    }
  }

  saveData() {
    for (let i = 0; i < this.dataManager.length; i++) {
      this.dataManager[i].saveData();
    }
  }

  recoverData() {
    for (let i = 0; i < this.dataManager.length; i++) {
      this.dataManager[i].recoverData();
    }
  }

  destroyData() {
    for (let i = 0; i < this.dataManager.length; i++) {
      this.dataManager[i].destroyData();
    }
  }

  hasStoredData(): boolean {
    for (let i = 0; i < this.dataManager.length; i++) {
      if (this.dataManager[i].hasStoredData()) return true;
    }

    return false;
  }
}

export type Props = {
  formId?: string | string[];
  keyPrefix?: string;
  expiredHour?: number;
  password?: string;
};

let instance: (FormInputRecover | null) = null;
export const createInstance = (props: Props) => {
  // ローカルストレージがサポートされていない場合は何もしない
  if (!isSupportStorage()) return null;
  if (instance) return instance;

  instance = new FormInputRecover(props);
  return instance;
};
