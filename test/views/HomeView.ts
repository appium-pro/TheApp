import {BaseView} from './BaseView';
import {EchoBoxView} from './EchoBoxView';

export enum View {
  ECHO,
}

export class HomeView extends BaseView {
  S = {
    echoBox: '~Echo Box',
  } as const;

  async navToView(view: View) {
    const [selector, NextView] = (() => {
      switch (view) {
        case View.ECHO:
          return [this.$.echoBox, EchoBoxView];
      }
    })();
    await this.click(selector);
    return this.pushView(NextView) as InstanceType<typeof NextView>;
  }
}
