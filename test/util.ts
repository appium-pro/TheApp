import type {Browser, RemoteOptions} from 'webdriverio';
import {remote} from 'webdriverio';
import axios from 'axios';
import {
  getCaps,
  IS_HEADSPIN,
  HEADSPIN_SERVER_OPTS,
  LOCAL_SERVER_OPTS,
  DEBUG,
  BUILD_ID,
  HEADSPIN_API_TOKEN,
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
    if (BUILD_ID) {
      capabilities['headspin:sessionTags'] = [{build: BUILD_ID}];
    }
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
  afterEach(async function () {
    if (obj.driver) {
      const sessionId = obj.driver.sessionId;
      debug.log('Deleting session');
      await obj.driver.deleteSession();
      if (IS_HEADSPIN) {
        const status = this.currentTest?.isPassed() ? 'passed' : 'failed';
        debug.log(`Reporting ${status} session status to HeadSpin`);
        const reportingUrl = `https://${HEADSPIN_API_TOKEN}@api-dev.headspin.io/v0/perftests/upload`;
        await axios.post(reportingUrl, {status, session_id: sessionId});
        const webUrl = `https://ui-dev.headspin.io/sessions/${sessionId}/waterfall`;
        debug.log(`HeadSpin web link: ${webUrl}`);
      }
    }
  });
  return obj as HarnessObj; // we know the props will be on this but TS doesn't
}
