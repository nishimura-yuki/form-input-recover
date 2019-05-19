type Props = {
  fallbackLng: string;
  resources: {
    [key: string]: {
      translation: {
        [key: string]: string;
      },
    };
  };
};

class I18n {
  private fallbackLng: string;
  private currentResource: {
    translation: {
      [key: string]: string;
    },
  };
  private fallbackResource: {
    translation: {
      [key: string]: string;
    },
  };
  private resources: {
    [key: string]: {
      translation: {
        [key: string]: string;
      },
    },
  };

  constructor(props: Props) {
    this.fallbackLng = props.fallbackLng;
    this.resources = {};
    const keys = Object.keys(props.resources);
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];
      this.resources[key] = props.resources[key];
      this.currentResource = props.resources[key];
      this.fallbackResource = props.resources[key];
    }

    if (this.resources[this.fallbackLng]) {
      this.fallbackResource = this.resources[this.fallbackLng];
    }
  }

  changeLanguage(lang: string) {
    if (this.resources[lang]) {
      this.currentResource = this.resources[lang];
    }
  }

  t(key: string): string {
    if (this.currentResource.translation[key]) {
      return this.currentResource.translation[key];
    }
    if (this.fallbackResource.translation[key]) {
      return this.fallbackResource.translation[key];
    }
    return '';
  }
}

const singleton = new I18n({
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {
        confirmMessage: 'Are you sure you want to recover the previous input data?',
        recover: 'Recover',
        destroy: 'Destroy',
        close: 'Close',
      },
    },
    ja: {
      translation: {
        confirmMessage: '以前入力した内容に戻しますか？',
        recover: '戻す',
        destroy: '削除',
        close: '閉じる',
      },
    },
  },
});

export default singleton;
