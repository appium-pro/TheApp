import path from 'path';

export enum Platform {
  IOS,
  ANDROID,
}

export enum Device {
  REAL,
  VIRTUAL,
}

const LOCAL_ANDROID_APK = path.resolve(
  __dirname,
  '..',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'release',
  'app-release.apk',
);

export const ANDROID_PACKAGE_ID = 'com.appiumpro.the_app';

const LOCAL_IOS_APP = path.resolve(
  __dirname,
  '..',
  'ios',
  'DerivedData',
  'TheApp',
  'Build',
  'Products',
  'Release-iphonesimulator',
  'TheApp.app',
);

export const IOS_BUNDLE_ID = 'com.appiumpro.the_app';

export const BUILD_ID = process.env.BUILD_ID;
export const IS_IOS = process.env.IOS;
export const IS_ANDROID = process.env.ANDROID;
export const IS_HEADSPIN = process.env.HEADSPIN;
export const HEADSPIN_API_TOKEN = process.env.HEADSPIN_API_TOKEN;
export const HEADSPIN_APP_ID = process.env.HEADSPIN_APP_ID;
export const REAL_DEVICE = process.env.REAL_DEVICE || IS_HEADSPIN;
export const DEBUG = process.env.DEBUG;
export const PLATFORM = IS_IOS ? Platform.IOS : Platform.ANDROID;
export const DEVICE = REAL_DEVICE ? Device.REAL : Device.VIRTUAL;

if (!IS_IOS && !IS_ANDROID) {
  throw new Error('Must specify IOS or ANDROID in env');
}

if (IS_IOS && IS_ANDROID) {
  throw new Error("Test can't be both IOS and ANDROID");
}

if (IS_HEADSPIN && !HEADSPIN_API_TOKEN) {
  throw new Error('Running on HeadSpin requires an API token set');
}

if (IS_HEADSPIN && !HEADSPIN_APP_ID) {
  throw new Error('Running on HeadSpin requires HEADSPIN_APP_ID set');
}

export const LOCAL_SERVER_OPTS = {
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
};

export const HEADSPIN_SERVER_OPTS = {
  hostname: 'appium-dev.headspin.io',
  port: 443,
  path: `/v0/${HEADSPIN_API_TOKEN}/wd/hub`,
  protocol: 'https',
  connectionRetryTimeout: 300000,
};

const ANDROID_BASE_CAPS = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
};

const IOS_BASE_CAPS = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:showXcodeLog': DEBUG && !IS_HEADSPIN ? true : undefined,
  'appium:showIOSLog': DEBUG && !IS_HEADSPIN ? true : undefined,
};

const HEADSPIN_BASE_CAPS = {
  'headspin:app.id': HEADSPIN_APP_ID,
  'headspin:capture.video': true,
  'headspin:newCommandTimeout': 300,
  'headspin:retryNewSessionFailure': false, // don't retry on different devices if a session fails
};

const HEADSPIN_IOS_CAPS = {
  ...HEADSPIN_BASE_CAPS,
  ...IOS_BASE_CAPS,
  'headspin:selector':
    'device_type:ios geos:"Palo Alto, US"  device_skus:"iPhone XR"',
};

const HEADSPIN_ANDROID_CAPS = {
  ...HEADSPIN_BASE_CAPS,
  ...ANDROID_BASE_CAPS,
  'headspin:selector':
    'device_type:android geos:"Palo Alto, US",geos:"Mountain View, US" device_skus:"Pixel 4",device_skus:"Galaxy S23"',
};

const LOCAL_BASE_CAPS = {};

const LOCAL_IOS_CAPS = {
  ...LOCAL_BASE_CAPS,
  ...IOS_BASE_CAPS,
  'appium:platformVersion': '16.2',
  'appium:deviceName': 'iPhone 13',
  'appium:app': LOCAL_IOS_APP,
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
