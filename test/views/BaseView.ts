import {Platform} from '../caps';
import {Browser} from 'webdriverio';

interface AugmentedBrowser extends Browser {
  viewStack?: BaseView[];
}

export class BaseView {
  platform: Platform;
  driver: AugmentedBrowser;

  constructor(platform: Platform, driver: AugmentedBrowser) {
    this.platform = platform;
    this.driver = driver;

    if (!this.driver.viewStack) {
      this.driver.viewStack = [];
    }

    // whatever the first view is that we construct, make it the first view in the stack
    if (this.driver.viewStack.length === 0) {
      this.driver.viewStack.push(this);
    }
  }

  async back() {
    if (!this.driver.viewStack) {
      throw new Error('Driver has no view stack attached');
    }
    if (this.driver.viewStack.length < 2) {
      throw new Error("Can't go back, view stack is empty");
    }
    await this.driver.back();
    this.driver.viewStack.pop();
    return this.driver.viewStack.at(-1);
  }

  pushView(View: typeof BaseView) {
    const view = new View(this.platform, this.driver);
    this.driver.viewStack?.push(view);
    return view;
  }
}
