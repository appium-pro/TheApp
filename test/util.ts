import type {Browser, RemoteOptions} from 'webdriverio';
import {remote} from 'webdriverio';
import {
  getCaps,
  IS_HEADSPIN,
  HEADSPIN_SERVER_OPTS,
  LOCAL_SERVER_OPTS,
  DEBUG,
} from './caps';
import {HomeView} from './views/HomeView';

export interface HarnessObj {
  driver: Browser;
  home: HomeView;
}

interface HarnessOpts {
  beforeFn?: (home: HomeView) => Promise<void>;
  noLaunch?: boolean;
}

interface StartSessionOpts {
  noLaunch?: boolean;
  testName: string;
}

export async function startSession({
  noLaunch = false,
  testName,
}: StartSessionOpts) {
  const capabilities = getCaps();
  const opts = IS_HEADSPIN ? HEADSPIN_SERVER_OPTS : LOCAL_SERVER_OPTS;

  if (noLaunch) {
    delete capabilities['appium:app'];
  }

  if (IS_HEADSPIN) {
    capabilities['headspin:testName'] = testName;
  }

  const wdioParams: RemoteOptions = {
    ...opts,
    connectionRetryCount: 0,
    logLevel: DEBUG ? 'info' : 'silent',
    capabilities,
  };

  return await remote(wdioParams);
}

const silentConsole = {
  log: () => {},
  error: () => {},
  warn: () => {},
};
export const debug = DEBUG ? console : silentConsole;

export function testHarness({beforeFn, noLaunch = false}: HarnessOpts = {}) {
  const obj: Partial<HarnessObj> = {};
  beforeEach(async function () {
    debug.log('Starting Session');
    obj.driver = await startSession({
      noLaunch,
      testName: this.currentTest?.fullTitle() || 'unnamed TheApp test',
    });
    obj.home = new HomeView(obj.driver);
    if (beforeFn) {
      await beforeFn(obj.home);
    }
  });
  afterEach(async () => {
    if (obj.driver) {
      debug.log('Deleting session');
      await obj.driver.deleteSession();
    }
  });
  return obj as HarnessObj; // we know the props will be on this but TS doesn't
}
