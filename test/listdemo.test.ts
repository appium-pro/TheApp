import {testHarness} from './util';
import expect from 'expect';

describe('List Demo', () => {
  const harness = testHarness();
  it('should tap a cloud and get information about it', async () => {
    const {home} = harness;
    const cloud = 'ScienceSoft';
    const listScreen = await home.navToListDemo();
    await listScreen.chooseCloud(cloud);
    await listScreen.learnMore(cloud);
    const description = await listScreen.getLearnMoreText(cloud);
    expect(description).toContain('cloud infrastructure services');
    await listScreen.acceptAlert();
  });
});
