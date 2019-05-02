
exports.putValues = async (page) => {
  await page.type('input[name="email"]', "text sample");
  await page.type('input[name="password"]', "password sample");
  await page.type('textarea[name="textarea"]', "textarea sample1\ntextarea sample3\ntextarea sample3");
  await page.click('#radio2');
  await page.select('select[name="select"]', 'select3');
  await page.$eval('select[name="multipleselect"]', (elm) => {
    for (let i = 0; i < elm.options.length; i++) {
      const opt = elm.options[i];
      if (['multipleselect2', 'multipleselect4'].includes(opt.value)) {
        opt.selected = true;
      }
    }
    const e = new Event('change');
    elm.dispatchEvent(e);
  });
  await page.click('input[name="checkbox"][value="checkbox1"]');
  await page.click('input[name="checkbox"][value="checkbox3"]');
}

