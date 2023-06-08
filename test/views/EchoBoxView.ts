import {BaseView} from './BaseView';
import {HomeView} from './HomeView';

export class EchoBoxView extends BaseView {
  S_ANDROID = {
    input: '~messageInput',
    save: '~messageSaveBtn',
    savedMsg: '//*[@resource-id="savedMessage"]',
  } as const;

  S_IOS = {
    ...this.S_ANDROID,
    savedMsg: '~savedMessage',
  } as const;

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
