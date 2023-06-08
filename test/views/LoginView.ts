import {BaseView} from './BaseView';
import {SecretView} from './SecretView';

const S = {
  password: '~password',
  loginBtn: '~loginBtn',
  username: '~username',
};

export class LoginView extends BaseView {
  S_IOS = {
    ...S,
    username: '//XCUIElementTypeTextField[@name="username"]',
    alertMsg: '//XCUIElementTypeAlert//*[contains(@name, "Invalid")]',
    alertBtn: '~OK',
  };

  S_ANDROID = {
    ...S,
    alertMsg: '//*[@resource-id="android:id/message"]',
    alertBtn: '//*[@resource-id="android:id/button1"]',
  };

  viewVerificationSelectors = ['username'];

  async login(username: string, password: string) {
    await this.sendKeys(this.$.username, username);
    await this.sendKeys(this.$.password, password);
    await this.click(this.$.loginBtn);
    return SecretView.from(this);
  }

  async handleInvalidLoginAlert() {
    await this.find(this.$.alertMsg);
    await this.click(this.$.alertBtn);
  }
}
