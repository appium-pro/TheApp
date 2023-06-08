import {BaseView} from './BaseView';

export class SecretView extends BaseView {
  S_IOS = {
    loggedInMsg:
      '//XCUIElementTypeStaticText[contains(@name, "You are logged in as")]',
  };

  S_ANDROID = {
    loggedInMsg:
      '//android.widget.TextView[contains(@text, "You are logged in as")]',
  };

  async getLoggedInUser() {
    const loggedInText = await this.getText(this.$.loggedInMsg);
    const match = loggedInText.match(/You are logged in as (.+)/);
    if (!match) {
      throw new Error('Cannot find logged in username');
    }
    return match[1];
  }
}
