import {Platform} from '../caps';
import {BaseView, Wait} from './BaseView';

export class ListView extends BaseView {
  S_IOS = {
    learnMoreButton(cloud: string) {
      return `~Learn more about ${cloud}`;
    },
    learnMoreText(cloud: string) {
      return `//XCUIElementTypeStaticText[@name='${cloud}']/following-sibling::XCUIElementTypeStaticText`;
    },
    alertBtn: '~OK',
  } as const;

  S_ANDROID = {
    learnMoreButton(cloud: string) {
      return `//android.widget.Button[@text='LEARN MORE ABOUT ${cloud.toUpperCase()}']`;
    },
    learnMoreText() {
      return '//android.widget.TextView[@resource-id="android:id/message"]';
    },
    alertBtn: '//*[@resource-id="android:id/button1"]',
  } as const;

  async chooseCloud(cloud: string) {
    let cloudEl = await this.#getCloudElement(cloud);
    let tries = 0;
    while (!cloudEl) {
      tries += 1;
      await this.scrollDown();
      cloudEl = await this.#getCloudElement(cloud);
      if (tries > 4) {
        throw new Error(`Could not scroll to cloud named ${cloud}`);
      }
    }
    await cloudEl.click();
  }

  async learnMore(cloud: string) {
    await this.click(this.$f.learnMoreButton(cloud));
  }

  async getLearnMoreText(cloud: string) {
    return await this.getText(this.$f.learnMoreText(cloud));
  }

  async acceptAlert() {
    await this.click(this.$.alertBtn);
  }

  async #getCloudElement(cloud: string) {
    try {
      const cloudEl = await this.find(`~${cloud}`, Wait.SHORT);
      if (!(await cloudEl.isDisplayed())) {
        return null;
      }
      return cloudEl;
    } catch (ign) {
      return null;
    }
  }
}
