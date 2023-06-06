import {Platform} from '../caps';
import {AugmentedBrowser, BaseView} from './BaseView';
import {HomeView} from './HomeView';

const S_ANDROID = {
  input: '~messageInput',
  save: '~messageSaveBtn',
  savedMsg: '//*[@resource-id="savedMessage"]',
} as const;

const S_IOS = {
  ...S_ANDROID,
  savedMsg: '~savedMessage',
} as const;

export class EchoBoxView extends BaseView {
  S: typeof S_ANDROID | typeof S_IOS;

  constructor(platform: Platform, driver: AugmentedBrowser) {
    super(platform, driver);
    this.S = S_ANDROID;
    if (platform === Platform.IOS) {
      this.S = S_IOS;
    }
  }

  async setEchoText(text: string) {
    const input = await this.driver.$(this.S.input);
    await input.setValue(text);
    const saveBtn = await this.driver.$(this.S.save);
    await saveBtn.click();
  }

  async getEchoText() {
    try {
      const msg = await this.driver.$(this.S.savedMsg);
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
