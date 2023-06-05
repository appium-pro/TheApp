import {BaseView} from './BaseView';
import {HomeView} from './HomeView';

const S = {
  input: '~messageInput',
  save: '~messageSaveBtn',
  savedMsg: '//*[@resource-id="savedMessage"]',
} as const;

export class EchoBoxView extends BaseView {
  async setEchoText(text: string) {
    const input = await this.driver.$(S.input);
    await input.setValue(text);
    const saveBtn = await this.driver.$(S.save);
    await saveBtn.click();
  }

  async getEchoText() {
    try {
      const msg = await this.driver.$(S.savedMsg);
      return await msg.getText();
    } catch (ign) {
      // if we get an error it means the element doesn't exist
      return '';
    }
  }

  async back() {
    return (await super.back()) as HomeView;
  }
}
