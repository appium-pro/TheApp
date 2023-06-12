import {HomeView} from './views/HomeView';
import expect from 'expect';
import {EchoBoxView} from './views/EchoBoxView';
import {testHarness} from './util';

describe('Echo Box', () => {
  let echo: EchoBoxView;
  testHarness({
    beforeFn: async (homeView: HomeView) => {
      echo = await homeView.navToEchoBox();
    },
  });
  it('should start with nothing in the box', async () => {
    expect(await echo.getEchoText()).toBe('');
  });
  it('should echo back the input and save it', async () => {
    await echo.setEchoText('foo');
    expect(await echo.getEchoText()).toBe('foo');

    // should stick around if we go to home page and back
    const home = await echo.back();
    await home.navToEchoBox();
    expect(await echo.getEchoText()).toBe('foo');
  });
});
