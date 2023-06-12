import B from 'bluebird';
import {IOS_BUNDLE_ID, Platform, Device, PLATFORM, DEVICE} from '../caps';
import {Browser} from 'webdriverio';
import {ANDROID_PACKAGE_ID} from '../caps';
import {debug} from '../util';
import {Size} from 'webdriverio/build/commands/element';

export interface AugmentedBrowser extends Browser {
  viewStack?: BaseView[];
}

export enum Wait {
  SHORT = 3000,
  DEFAULT = 5000,
  LONG = 20000,
}

export enum ScrollDirection {
  DOWN,
  UP,
}

export type WaitTimeout = Wait | number;

export type SelectorMap = Record<string, string | ((x: string) => string)>;
export type StringSelectorMap = Record<string, string>;
export type FunctionSelectorMap = Record<string, (x: string) => string>;

export class BaseView {
  platform: Platform;
  driver: AugmentedBrowser;
  device: Device;
  size: Size | null = null;

  S: SelectorMap | null = null;
  S_IOS: SelectorMap | null = null;
  S_ANDROID: SelectorMap | null = null;

  viewVerificationSelectors: string[] | null = null;

  constructor(
    driver: Browser,
    platform: Platform = PLATFORM,
    device: Device = DEVICE,
  ) {
    this.platform = platform;
    this.driver = driver as AugmentedBrowser;
    this.device = device;

    if (!this.driver.viewStack) {
      this.driver.viewStack = [];
    }

    // whatever the first view is that we construct, make it the first view in the stack
    if (this.driver.viewStack.length === 0) {
      this.driver.viewStack.push(this);
    }
  }

  get #$(): SelectorMap {
    if (this.platform === Platform.IOS && this.S_IOS) {
      return this.S_IOS;
    }
    if (this.platform === Platform.ANDROID && this.S_ANDROID) {
      return this.S_ANDROID;
    }
    if (this.S) {
      return this.S;
    }
    throw new Error(`Cannot find selectors defined for ${this.platform}`);
  }

  get $() {
    const s = this.#$;
    const stringSelectors: StringSelectorMap = {};
    for (const key of Object.keys(s)) {
      const val = s[key];
      if (typeof val === 'string') {
        stringSelectors[key] = val;
      }
    }
    return stringSelectors;
  }

  get $f() {
    const s = this.#$;
    const functionSelectors: FunctionSelectorMap = {};
    for (const key of Object.keys(s)) {
      const val = s[key];
      if (typeof val !== 'string') {
        functionSelectors[key] = val;
      }
    }
    return functionSelectors;
  }

  async verify(wait?: WaitTimeout) {
    if (!this.viewVerificationSelectors) {
      throw new Error("Can't verify view without viewVerificationSelector");
    }
    for (const selectorName of this.viewVerificationSelectors) {
      const selector = this.$[selectorName];
      debug.log(`Verifying view with selector ${selectorName} (${selector})`);
      if (!selector) {
        throw new Error(`Selector '${selector}' was not in this.$`);
      }
      await this.find(selector, wait);
    }
  }

  async back() {
    debug.log('#back()');
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
    debug.log('pushView()');
    const view = new View(this.driver, this.platform);
    this.driver.viewStack?.push(view);
    return view;
  }

  async find(selector: string, wait: WaitTimeout = Wait.DEFAULT) {
    debug.log(`find(${selector}, ${wait})`);
    const el = await this.driver.$(selector);
    await el.waitForExist({timeout: wait});
    return el;
  }

  async click(selector: string, wait?: WaitTimeout) {
    debug.log(`click(${selector}, ${wait})`);
    return (await this.find(selector, wait)).click();
  }

  async sendKeys(
    selector: string,
    keys: string,
    clear: boolean = true,
    wait?: WaitTimeout,
  ) {
    debug.log(`sendKeys(${selector}, ${keys}, clear: ${clear}, ${wait})`);
    const el = await this.find(selector, wait);
    if (clear) {
      await el.setValue(keys);
    } else {
      await el.addValue(keys);
    }
  }

  async getText(selector: string, wait?: WaitTimeout) {
    debug.log(`getText(${selector}, ${wait})`);
    return await (await this.find(selector, wait)).getText();
  }

  async deepLink(url: string) {
    debug.log(`deepLink(${url})`);
    const opts: {url: string; package?: string} = {url};

    // android case
    if (this.platform === Platform.ANDROID) {
      opts.package = ANDROID_PACKAGE_ID;
      await this.driver.executeScript('mobile: deepLink', [opts]);
      return;
    }

    // ios real device case
    if (this.device === Device.REAL) {
      opts.package = IOS_BUNDLE_ID;
      await this.driver.executeScript('mobile: deepLink', [opts]);
      return;
    }

    // ios simulator case
    await this.driver.navigateTo(url);
    try {
      // if it's the first time this is happening, might need to approve the alert
      await this.click('~Open', Wait.SHORT);
    } catch (ign) {}
  }

  async getAlertText(wait?: WaitTimeout) {
    debug.log(`getAlertText(${wait})`);
    const alertSelector =
      this.platform === Platform.IOS
        ? '//XCUIElementTypeAlert/descendant::XCUIElementTypeStaticText'
        : '//*[@resource-id="android:id/message"]';
    return await this.getText(alertSelector, wait);
  }

  async terminateApp(bundleId?: string) {
    debug.log(`terminateApp(${bundleId})`);
    if (!bundleId) {
      bundleId =
        this.platform === Platform.IOS ? IOS_BUNDLE_ID : ANDROID_PACKAGE_ID;
    }
    await this.driver.terminateApp(bundleId);
  }

  async sleep(ms: number) {
    debug.log(`sleep(${ms})`);
    await B.delay(ms);
  }

  async scroll(direction: ScrollDirection) {
    const {width, height} = await this.getSize();
    const topHeight = height * 0.1;
    const bottomHeight = height * 0.9;
    const startY =
      direction === ScrollDirection.DOWN ? bottomHeight : topHeight;
    const endY = direction === ScrollDirection.DOWN ? topHeight : bottomHeight;
    const start = {x: width / 2, y: startY};
    const end = {x: start.x, y: endY};
    try {
      return await this.driver
        .action('pointer')
        .move({duration: 0, origin: 'viewport', ...start})
        .down()
        .move({duration: 1000, origin: 'viewport', ...end})
        .up()
        .perform();
    } catch (err) {
      // ignore any android errors here for now since uiauto2 driver does not implement DELETE
      // /actions, neither do some older versions of the xcuitest driver
    }
  }

  async scrollDown() {
    return await this.scroll(ScrollDirection.DOWN);
  }

  async getSize(forceRefresh: boolean = false) {
    if (!this.size || forceRefresh) {
      const {width, height} = await this.driver.getWindowRect();
      this.size = {width, height};
    }
    return this.size;
  }

  static from<T extends typeof BaseView>(this: T, otherView: BaseView) {
    return new this(
      otherView.driver,
      otherView.platform,
      otherView.device,
    ) as InstanceType<T>;
  }
}
