import {BaseView} from './BaseView';
import {SecretView} from './SecretView';

export class LoginView extends BaseView {
  S = {
    password: '~password',
    loginBtn: '~loginBtn',
    username: '~username',
  };

  S_IOS = {
    username: '//XCUIElementTypeTextField[@name="username"]',
    alertMsg: '//XCUIElementTypeAlert//*[contains(@name, "Invalid")]',
    alertBtn: '~OK',
  };

  S_ANDROID = {
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
