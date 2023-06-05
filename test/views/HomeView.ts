import {BaseView} from './BaseView';
import {EchoBoxView} from './EchoBoxView';

export enum View {
  ECHO,
}

const S = {
  echoBox: '~Echo Box',
} as const;

export class HomeView extends BaseView {
  async navToView(view: View) {
    const [selector, NextView] = (() => {
      switch (view) {
        case View.ECHO:
          return [S.echoBox, EchoBoxView];
      }
    })();
    const el = await this.driver.$(selector);
    await el.click();
    return this.pushView(NextView) as InstanceType<typeof NextView>;
  }
}
