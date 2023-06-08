import expect from 'expect';
import {HarnessObj, testHarness} from './util';
import {View} from './views/HomeView';
import {LoginView} from './views/LoginView';
import {SecretView} from './views/SecretView';

const USER = 'alice';
const PW = 'mypassword';

const BAD_USER = 'foo';
const BAD_PW = 'bar';

async function loginViaLink(
  harness: HarnessObj,
  username: string,
  password: string,
) {
  const {home} = harness;
  await home.terminateApp();
  await home.deepLink(`theapp://login/${username}/${password}`);
  return home;
}

describe('Login to Secret Area', () => {
  describe('UI-based login', () => {
    const harness = testHarness();
    it('should log in with correct username and password', async () => {
      const {home} = harness;
      const loginScreen = (await home.navToView(View.LOGIN)) as LoginView;
      const secret = await loginScreen.login(USER, PW);
      expect(await secret.getLoggedInUser()).toEqual(USER);
    });
    it('should fail to log in with bad username or password', async () => {
      const {home} = harness;
      const loginScreen = (await home.navToView(View.LOGIN)) as LoginView;
      await loginScreen.login(BAD_USER, BAD_PW);
      await loginScreen.handleInvalidLoginAlert();
    });
  });
  describe('Deep link based login', () => {
    const harness = testHarness();
    it('should open the app via deep link with error for incorrect creds', async () => {
      const home = await loginViaLink(harness, BAD_USER, BAD_PW);
      expect(await home.getAlertText()).toContain('Invalid login credentials');
    });
    it('should open the app and redirect to secret area with correct creds', async () => {
      const home = await loginViaLink(harness, USER, PW);
      const secret = SecretView.from(home);
      expect(await secret.getLoggedInUser()).toEqual(USER);
    });
  });
});

describe('Logout', () => {
  const harness = testHarness();
  it('should log out', async () => {
    const secret = SecretView.from(await loginViaLink(harness, USER, PW));
    const login = await secret.logout();
    await login.verify();
  });
});
