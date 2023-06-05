import type {RemoteOptions} from 'webdriverio';
import {remote} from 'webdriverio';
import path from 'path';

export enum Platform {
  IOS,
  ANDROID,
}

const LOCAL_ANDROID_APK = path.resolve(
  __dirname,
  '..',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
);

if (!process.env.IOS && !process.env.ANDROID) {
  throw new Error('Must specify IOS or ANDROID in env');
}

export const IS_IOS = process.env.IOS;
export const IS_ANDROID = process.env.ANDROID;

if (IS_IOS && IS_ANDROID) {
  throw new Error("Test can't be both IOS and ANDROID");
}

export const PLATFORM = IS_IOS ? Platform.IOS : Platform.ANDROID;

export const IS_HEADSPIN = process.env.HEADSPIN;
export const HEADSPIN_API_TOKEN = process.env.HEADSPIN_API_TOKEN;

if (IS_HEADSPIN && !HEADSPIN_API_TOKEN) {
  throw new Error('Running on HeadSpin requires an API token set');
}

const LOCAL_SERVER_OPTS = {
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
};

const HEADSPIN_SERVER_OPTS = {
  hostname: 'appium-dev.headspin.io',
  port: 80,
  path: `/v0/${HEADSPIN_API_TOKEN}`,
  https: true,
};

const ANDROID_BASE_CAPS = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
};

const IOS_BASE_CAPS = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
};

const HEADSPIN_BASE_CAPS = {};

const HEADSPIN_IOS_CAPS = {
  ...HEADSPIN_BASE_CAPS,
  ...IOS_BASE_CAPS,
  'headspin:selector': '',
};

const HEADSPIN_ANDROID_CAPS = {
  ...HEADSPIN_BASE_CAPS,
  ...ANDROID_BASE_CAPS,
  'headspin:selector': '',
};

const LOCAL_BASE_CAPS = {};

const LOCAL_IOS_CAPS = {
  ...LOCAL_BASE_CAPS,
  ...IOS_BASE_CAPS,
};

const LOCAL_ANDROID_CAPS = {
  ...LOCAL_BASE_CAPS,
  ...ANDROID_BASE_CAPS,
  'appium:app': LOCAL_ANDROID_APK,
};

export function getCaps(): Record<string, any> {
  if (IS_IOS && IS_HEADSPIN) {
    return HEADSPIN_IOS_CAPS;
  } else if (IS_ANDROID && IS_HEADSPIN) {
    return HEADSPIN_ANDROID_CAPS;
  } else if (IS_IOS) {
    return LOCAL_IOS_CAPS;
  }
  return LOCAL_ANDROID_CAPS;
}

export async function startSession() {
  const capabilities = getCaps();
  const opts = IS_HEADSPIN ? HEADSPIN_SERVER_OPTS : LOCAL_SERVER_OPTS;

  const wdioParams: RemoteOptions = {
    ...opts,
    connectionRetryCount: 0,
    logLevel: 'silent',
    capabilities,
  };

  return await remote(wdioParams);
}
