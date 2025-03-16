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
const actionDelay = 1500;

beforeAll(async () => {
  driver = await new Builder().forBrowser('chrome').build();
  await driver.get('http://localhost:9000/login');
  await driver.sleep(actionDelay);
  await driver.findElement(By.name('username')).sendKeys('khanghy1000');
  await driver.findElement(By.name('password')).sendKeys('Test12345*');
  await driver.sleep(actionDelay);
  await driver.findElement(By.css('button[type=submit]')).click();
  await driver.wait(until.urlIs('http://localhost:9000/'), 5000);
  await driver.sleep(actionDelay);
});

afterAll(async () => {
  await driver.quit();
});

describe('Component Search Tests', () => {
  const componentTests = [
    { type: 'cpu', filter: 'Intel' },
    { type: 'mb', filter: 'ASUS' },
    { type: 'ram', filter: 'Corsair' },
    { type: 'vga', filter: 'NVIDIA' },
    { type: 'psu', filter: 'EVGA' },
    { type: 'cooler', filter: 'Cooler Master' },
    { type: 'storage', filter: 'Samsung' },
    { type: 'case', filter: 'NZXT' },
  ];

  componentTests.forEach(({ type, filter }) => {
    test(`Search ${type.toUpperCase()} Components`, async () => {
      await driver.get(`http://localhost:9000/component-select/${type}`);
      await driver.sleep(actionDelay);
      await driver.findElement(By.name('filter')).sendKeys(filter);
      await driver.sleep(actionDelay);
      await driver.findElement(By.id('submit-search')).click();
      await driver.sleep(actionDelay);
      const results = await driver.findElements(By.css('.component-item'));
      expect(results.length).toBeGreaterThan(0);
    });
  });
});

describe('Build Tests', () => {
  test('Search Public Build', async () => {
    await driver.get('http://localhost:9000/build_list_public');
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('user_description')).sendKeys('tầm trung');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    const results = await driver.findElements(By.css('.build-div'));
    expect(results.length).toBeGreaterThan(0);
  });

  test('Make New Build', async () => {
    await driver.get('http://localhost:9000/create_build');
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('input[name="name"]')).clear();
    const buildName = 'Test Build ' + Math.floor(Math.random() * 1000);
    await driver.findElement(By.css('input[name="name"]'));

    await driver
      .findElement(By.css('input[name="name"]'))
      .sendKeys(buildName + '\n');
    await driver.sleep(actionDelay);

    // Select Mainboard
    await driver.findElement(By.id('select-mb')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('X870E');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select CPU
    await driver.findElement(By.id('select-cpu')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('AMD Ryzen 7 7700X');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select VGA
    await driver.findElement(By.id('select-vga')).click();
    await driver.sleep(actionDelay);
    await driver
      .findElement(By.name('filter'))
      .sendKeys('Asus TUF GAMING GeForce RTX 4080 SUPER');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select RAM
    await driver.findElement(By.id('select-ram')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('DDR5-4800');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select Storage
    await driver.findElement(By.id('select-storage')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('Crucial BX500');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select PSU
    await driver.findElement(By.id('select-psu')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('NZXT E850');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select Cooler
    await driver.findElement(By.id('select-cooler')).click();
    await driver.sleep(actionDelay);
    await driver
      .findElement(By.name('filter'))
      .sendKeys('Asus ROG STRIX LC II ARGB');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select Case
    await driver.findElement(By.id('select-case')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('Antec NX100');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

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

    const problemsDiv = await driver.findElements(By.id('problems'));
    expect(problemsDiv.length).toBe(0);
  });

  test('Show Build Problems', async () => {
    await driver.get('http://localhost:9000/create_build');
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('input[name="name"]')).clear();
    const buildName =
      'Test Build with problems ' + Math.floor(Math.random() * 1000);
    await driver.findElement(By.css('input[name="name"]'));

    await driver
      .findElement(By.css('input[name="name"]'))
      .sendKeys(buildName + '\n');
    await driver.sleep(actionDelay);

    // Select Mainboard
    await driver.findElement(By.id('select-mb')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('ASRock B660M Pro RS');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select CPU
    await driver.findElement(By.id('select-cpu')).click();
    await driver.sleep(actionDelay);
    await driver
      .findElement(By.name('filter'))
      .sendKeys('AMD Threadripper 3990X');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select VGA
    await driver.findElement(By.id('select-vga')).click();
    await driver.sleep(actionDelay);
    await driver
      .findElement(By.name('filter'))
      .sendKeys('PNY VERTO GeForce RTX 4090');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select RAM
    await driver.findElement(By.id('select-ram')).click();
    await driver.sleep(actionDelay);
    await driver
      .findElement(By.name('filter'))
      .sendKeys('Samsung M393B5170FH0-CH9 4 GB');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select Storage
    await driver.findElement(By.id('select-storage')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('Leven JS600');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select PSU
    await driver.findElement(By.id('select-psu')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('Logisys PS480D2');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select Cooler
    await driver.findElement(By.id('select-cooler')).click();
    await driver.sleep(actionDelay);
    await driver
      .findElement(By.name('filter'))
      .sendKeys('Thermaltake Gravity A2');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    // Select Case
    await driver.findElement(By.id('select-case')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.name('filter')).sendKeys('Silverstone SG13 V2');
    await driver.sleep(actionDelay);
    await driver.findElement(By.id('submit-search')).click();
    await driver.sleep(actionDelay);
    await driver.findElement(By.css('.select-button')).click();
    await driver.sleep(actionDelay);

    const ramMainboardProblem = await driver.findElement(
      By.css('.ram-mainboard-problem')
    );
    const cpuMainboardProblem = await driver.findElement(
      By.css('.cpu-mainboard-problem')
    );

    const mainboardCaseSizeProblem = await driver.findElement(
      By.css('.mainboard-case-size-problem')
    );
    const psuCaseSizeProblem = await driver.findElement(
      By.css('.psu-case-size-problem')
    );
    const vgaCaseSizeProblem = await driver.findElement(
      By.css('.vga-case-size-problem')
    );

    expect(await ramMainboardProblem.getText()).toBeTruthy();
    expect(await cpuMainboardProblem.getText()).toBeTruthy();
    expect(await mainboardCaseSizeProblem.getText()).toBeTruthy();
    expect(await psuCaseSizeProblem.getText()).toBeTruthy();
    expect(await vgaCaseSizeProblem.getText()).toBeTruthy();
  });
});
