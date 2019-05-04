import i18next from 'i18next';

i18next.init({
  fallbackLng: 'en',
  debug: true,
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

export default i18next;
