import type {Browser} from 'webdriverio';
import {startSession, PLATFORM} from './caps';
import {HomeView, View} from './views/HomeView';
import expect from 'expect';
import {EchoBoxView} from './views/EchoBoxView';

describe('Echo Box', () => {
  let driver: Browser;
  let home: HomeView;
  let echo: EchoBoxView;
  beforeEach(async () => {
    driver = await startSession();
    home = new HomeView(PLATFORM, driver);
    echo = await home.navToView(View.ECHO);
  });
  afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
    }
  });
  it('should start with nothing in the box', async () => {
    expect(await echo.getEchoText()).toBe('');
  });
  it('should echo back the input and save it', async () => {
    await echo.setEchoText('foo');
    expect(await echo.getEchoText()).toBe('foo');

    // should stick around if we go to home page and back
    home = await echo.back();
    echo = await home.navToView(View.ECHO);
    expect(await echo.getEchoText()).toBe('foo');
  });
});
