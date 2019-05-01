import { putValues } from './helper';

describe('simple-modal', () => {
  const timeout = 5000;
  let page;

  beforeEach(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto('http://localhost:9091/sample-modal.html', { waitUntil: "domcontentloaded" });
    await putValues(page);
  }, timeout);

  const getLocalstorageData = async (page) => {
    return await page.evaluate(() => {
      const keyName = `__forminputrecover_${encodeURIComponent(location.pathname)}_default`;
      return localStorage.getItem(keyName);
    });
  }

  const assertForEmpty = async (page) => {
    const text = await page.$eval('input[name="email"]', item => item.value);
    expect(text).toBe('');
    const password = await page.$eval('input[name="password"]', item => item.value);
    expect(password).toBe('');
    const textarea = await page.$eval('textarea[name="textarea"]', item => item.value);
    expect(textarea).toBe('');
    const radio1 = await page.$eval('#radio1', item => item.checked);
    expect(radio1).toBe(false);
    const radio2 = await page.$eval('#radio2', item => item.checked);
    expect(radio2).toBe(false);
    const select = await page.$eval('select[name="select"]', item => item.value);
    expect(select).toBe('');
    const multipleselect = await page.$eval('select[name="multipleselect"]', item => item.value);
    expect(multipleselect).toBe('');
    const checkbox1 = await page.$eval('input[name="checkbox"][value="checkbox1"]', item => item.checked);
    expect(checkbox1).toBe(false);
    const checkbox2 = await page.$eval('input[name="checkbox"][value="checkbox2"]', item => item.checked);
    expect(checkbox2).toBe(false);
    const checkbox3 = await page.$eval('input[name="checkbox"][value="checkbox3"]', item => item.checked);
    expect(checkbox3).toBe(false);
  };

  it('復元の確認', async () => {
    await page.reload();

    // valueがセットされていないことを確認
    await assertForEmpty(page);

    // 復元ボタンクリック
    await page.click('#form-input-recover-confirm-modal .buttonRecover');

    // 値がセットされていることを確認
    const text = await page.$eval('input[name="email"]', item => item.value);
    expect(text).toBe('text sample');
    const password = await page.$eval('input[name="password"]', item => item.value);
    expect(password).toBe('');
    const textarea = await page.$eval('textarea[name="textarea"]', item => item.value);
    expect(textarea).toBe('textarea sample1\ntextarea sample3\ntextarea sample3');
    const radio1 = await page.$eval('#radio1', item => item.checked);
    expect(radio1).toBe(false);
    const radio2 = await page.$eval('#radio2', item => item.checked);
    expect(radio2).toBe(true);
    const select = await page.$eval('select[name="select"]', item => item.value);
    expect(select).toBe('select3');
    const multipleselect = await page.$eval('select[name="multipleselect"]', (item) => {
      const s = [];
      for (let i = 0; i < item.options.length; i++) {
        const opt = item.options[i];
        if (opt.selected) {
          s.push(opt.value);
        }
      }
      return s;
    });
    expect(multipleselect).toEqual(['multipleselect2', 'multipleselect4']);
    const checkbox1 = await page.$eval('input[name="checkbox"][value="checkbox1"]', item => item.checked);
    expect(checkbox1).toBe(true);
    const checkbox2 = await page.$eval('input[name="checkbox"][value="checkbox2"]', item => item.checked);
    expect(checkbox2).toBe(false);
    const checkbox3 = await page.$eval('input[name="checkbox"][value="checkbox3"]', item => item.checked);
    expect(checkbox3).toBe(true);

    // モーダルが閉じていることを確認
    const modalDisplay = await page.$eval('#form-input-recover-confirm-modal', item => item.style.display);
    expect(modalDisplay).toBe('none');

    // localstorageにデータが存在することを確認
    const data = await getLocalstorageData(page);
    expect(data).not.toBe('');
    expect(data).not.toBe(null);
    expect(data).not.toBe(undefined);

    // Submit実行
    await page.$eval('form', (form) => {
      const e = new Event('submit');
      form.dispatchEvent(e);
      form.submit();
    });
    expect(page.url()).toContain('sample-submit.html');

    // localstorageからデータが削除されていることを確認
    await page.goto('http://localhost:9091/sample-modal.html', { waitUntil: "domcontentloaded" });
    const dataAfter = await getLocalstorageData(page);
    expect(dataAfter).toBe(null);

    // await page.screenshot({ path: 'screenshot.png', fullPage: true })
  }, timeout);

  it('削除の確認', async () => {
    await page.reload();

    // valueがセットされていないことを確認
    await assertForEmpty(page);

    // localstorageにデータが存在することを確認
    const data = await getLocalstorageData(page);
    expect(data).not.toBe('');
    expect(data).not.toBe(null);
    expect(data).not.toBe(undefined);

    // 削除ボタンクリック
    await page.click('#form-input-recover-confirm-modal .buttonDestroy');

    // valueがセットされていないことを確認
    await assertForEmpty(page);
    
    // モーダルが閉じていることを確認
    const modalDisplay = await page.$eval('#form-input-recover-confirm-modal', item => item.style.display);
    expect(modalDisplay).toBe('none');

    // localstorageからデータが削除されていることを確認
    const dataAfter = await getLocalstorageData(page);
    expect(dataAfter).toBe(null);

  }, timeout);


  it('閉じるの確認', async () => {
    await page.reload();

    // valueがセットされていないことを確認
    await assertForEmpty(page);

    // 閉じるボタンクリック
    await page.click('#form-input-recover-confirm-modal .buttonClose');

    // valueがセットされていないことを確認
    await assertForEmpty(page);

    // モーダルが閉じていることを確認
    const modalDisplay = await page.$eval('#form-input-recover-confirm-modal', item => item.style.display);
    expect(modalDisplay).toBe('none');

    // localstorageにデータが存在することを確認
    const data = await getLocalstorageData(page);
    expect(data).not.toBe('');
    expect(data).not.toBe(null);
    expect(data).not.toBe(undefined);

    // Submit実行
    await page.$eval('form', (form) => {
      const e = new Event('submit');
      form.dispatchEvent(e);
      form.submit();
    });
    expect(page.url()).toContain('sample-submit.html');

    // localstorageからデータが削除されていることを確認
    await page.goto('http://localhost:9091/sample-modal.html', { waitUntil: "domcontentloaded" });
    const dataAfter = await getLocalstorageData(page);
    expect(dataAfter).toBe(null);

  }, timeout);

});