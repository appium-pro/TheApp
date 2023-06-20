import {BaseView} from './BaseView';
import {HomeView} from './HomeView';

export class EchoBoxView extends BaseView {
  S = {
    input: '~messageInput',
    save: '~messageSaveBtn',
  };

  S_ANDROID = {
    savedMsg: '//*[@resource-id="savedMessage"]',
  };

  S_IOS = {
    savedMsg: '~savedMessage',
  };

  async setEchoText(text: string) {
    await this.sendKeys(this.$.input, text);
    await this.click(this.$.save);
  }

  async getEchoText() {
    try {
      return await this.getText(this.$.savedMsg);
    } catch (ign) {
      // if we get an error it means the element doesn't exist
      return '';
    }
  }

  async back() {
    return (await super.back()) as HomeView;
  }
}
