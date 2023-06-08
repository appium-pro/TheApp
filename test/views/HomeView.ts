import {BaseView} from './BaseView';
import {EchoBoxView} from './EchoBoxView';
import {LoginView} from './LoginView';

export enum View {
  ECHO,
  LOGIN,
}

export class HomeView extends BaseView {
  S = {
    echoBox: '~Echo Box',
    login: '~Login Screen',
  };

  async navToView(view: View) {
    const [selector, NextView] = (() => {
      switch (view) {
        case View.ECHO:
          return [this.$.echoBox, EchoBoxView];
        case View.LOGIN:
          return [this.$.login, LoginView];
      }
    })();
    await this.click(selector);
    return this.pushView(NextView) as InstanceType<typeof NextView>;
  }
}
