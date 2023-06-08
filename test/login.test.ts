import expect from 'expect';
import {testHarness} from './util';
import {SecretView} from './views/SecretView';

const USER = 'alice';
const PW = 'mypassword';

const BAD_USER = 'foo';
const BAD_PW = 'bar';

describe('Login to Secret Area', () => {
  describe('UI-based login', () => {
    // TODO
  });
  describe('Deep link based login', () => {
    const harness = testHarness();
    it('should open the app via deep link with error for incorrect creds', async () => {
      const {home} = harness;
      await home.terminateApp();
      await home.deepLink(`theapp://login/${BAD_USER}/${BAD_PW}`);
      expect(await home.getAlertText()).toContain('Invalid login credentials');
    });
    it('should open the app and redirect to secret area with correct creds', async () => {
      const {home} = harness;
      await home.terminateApp();
      await home.deepLink(`theapp://login/${USER}/${PW}`);
      const secret = SecretView.from(home);
      expect(await secret.getLoggedInUser()).toEqual(USER);
    });
  });
});
