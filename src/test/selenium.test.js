const { Builder, By, until } = require('selenium-webdriver');
const {
  describe,
  beforeAll,
  afterAll,
  test,
  expect,
} = require('@jest/globals');

jest.setTimeout(5 * 60 * 1000);

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
  await driver.get('http://localhost:9000/login');
  await driver.sleep(1500);
  await driver.findElement(By.name('username')).sendKeys('khanghy1000');
  await driver.findElement(By.name('password')).sendKeys('Test12345*');
  await driver.sleep(1500);
  await driver.findElement(By.css('button[type=submit]')).click();
  await driver.wait(until.urlIs('http://localhost:9000/'), 5000);
  await driver.sleep(1500);
});

afterAll(async () => {
  await driver.quit();
});

describe('Component Search Tests', () => {
  test('Search CPU Components', async () => {
    await driver.get('http://localhost:9000/component-select/cpu');
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('Intel');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.component-item'));
    expect(results.length).toBeGreaterThan(0);
  });

  test('Search Mainboard Components', async () => {
    await driver.get('http://localhost:9000/component-select/mb');
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('ASUS');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.component-item'));
    expect(results.length).toBeGreaterThan(0);
  });

  test('Search RAM Components', async () => {
    await driver.get('http://localhost:9000/component-select/ram');
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('Corsair');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.component-item'));
    expect(results.length).toBeGreaterThan(0);
  });

  test('Search VGA Components', async () => {
    await driver.get('http://localhost:9000/component-select/vga');
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('NVIDIA');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.component-item'));
    expect(results.length).toBeGreaterThan(0);
  });

  test('Search PSU Components', async () => {
    await driver.get('http://localhost:9000/component-select/psu');
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('EVGA');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.component-item'));
    expect(results.length).toBeGreaterThan(0);
  });

  test('Search CPU Cooler Components', async () => {
    await driver.get('http://localhost:9000/component-select/cooler');
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('Cooler Master');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.component-item'));
    expect(results.length).toBeGreaterThan(0);
  });

  test('Search Storage Components', async () => {
    await driver.get('http://localhost:9000/component-select/storage');
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('Samsung');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.component-item'));
    expect(results.length).toBeGreaterThan(0);
  });

  test('Search Case Components', async () => {
    await driver.get('http://localhost:9000/component-select/case');
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('NZXT');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.component-item'));
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('Build Tests', () => {
  test('Make New Build', async () => {
    await driver.get('http://localhost:9000/create_build');
    await driver.sleep(1500);
    await driver.findElement(By.css('input[name="name"]')).clear();
    const buildName = 'Test Build ' + Math.floor(Math.random() * 1000);
    await driver.findElement(By.css('input[name="name"]'));

    await driver
      .findElement(By.css('input[name="name"]'))
      .sendKeys(buildName + '\n');
    await driver.sleep(1500);

    // Select Mainboard
    await driver.findElement(By.id('select-mb')).click();
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('X870E');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(1500);

    // Select CPU
    await driver.findElement(By.id('select-cpu')).click();
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('AMD Ryzen 7 7700X');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(1500);

    // Select VGA
    await driver.findElement(By.id('select-vga')).click();
    await driver.sleep(1500);
    await driver
      .findElement(By.name('filter'))
      .sendKeys('Asus TUF GAMING GeForce RTX 4080 SUPER');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(1500);

    // Select RAM
    await driver.findElement(By.id('select-ram')).click();
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('DDR5-4800');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(1500);

    // Select Storage
    await driver.findElement(By.id('select-storage')).click();
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('Crucial BX500');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(1500);

    // Select PSU
    await driver.findElement(By.id('select-psu')).click();
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('NZXT E850');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(1500);

    // Select Cooler
    await driver.findElement(By.id('select-cooler')).click();
    await driver.sleep(1500);
    await driver
      .findElement(By.name('filter'))
      .sendKeys('Asus ROG STRIX LC II ARGB');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(1500);

    // Select Case
    await driver.findElement(By.id('select-case')).click();
    await driver.sleep(1500);
    await driver.findElement(By.name('filter')).sendKeys('Antec NX100');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(1500);

    expect(
      await driver
        .findElement(By.css('input[name="name"]'))
        .getAttribute('value')
    ).toBe(buildName);

    expect(
      (await driver.findElement(By.id('mb')).findElements(By.css('*'))).length
    ).toBeGreaterThan(0);
    expect(
      (await driver.findElement(By.id('cpu')).findElements(By.css('*'))).length
    ).toBeGreaterThan(0);
    expect(
      (await driver.findElement(By.id('vga')).findElements(By.css('*'))).length
    ).toBeGreaterThan(0);
    expect(
      (await driver.findElement(By.id('ram')).findElements(By.css('*'))).length
    ).toBeGreaterThan(0);
    expect(
      (await driver.findElement(By.id('storage')).findElements(By.css('*')))
        .length
    ).toBeGreaterThan(0);
    expect(
      (await driver.findElement(By.id('psu')).findElements(By.css('*'))).length
    ).toBeGreaterThan(0);
    expect(
      (await driver.findElement(By.id('cooler')).findElements(By.css('*')))
        .length
    ).toBeGreaterThan(0);
    expect(
      (await driver.findElement(By.id('case')).findElements(By.css('*'))).length
    ).toBeGreaterThan(0);
  });

  test('Search Public Build', async () => {
    await driver.get('http://localhost:9000/build_list_public');
    await driver.sleep(1500);
    await driver.findElement(By.name('user_description')).sendKeys('tầm trung');
    await driver.sleep(1500);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(1500);
    const results = await driver.findElements(By.css('.build-div'));
    expect(results.length).toBeGreaterThan(0);
  });
});
