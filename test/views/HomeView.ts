import {BaseView} from './BaseView';
import {EchoBoxView} from './EchoBoxView';
import {LoginView} from './LoginView';
import {ListView} from './ListView';

export enum View {
  ECHO,
  LOGIN,
  LIST,
}

export class HomeView extends BaseView {
  S = {
    echoBox: '~Echo Box',
    login: '~Login Screen',
    list: '~List Demo',
  };

  async #navToView(view: View) {
    const [selector, NextView] = (() => {
      switch (view) {
        case View.ECHO:
          return [this.$.echoBox, EchoBoxView];
        case View.LOGIN:
          return [this.$.login, LoginView];
        case View.LIST:
          return [this.$.list, ListView];
      }
    })();
    await this.click(selector);
    return this.pushView(NextView) as InstanceType<typeof NextView>;
  }

  async navToEchoBox() {
    return (await this.#navToView(View.ECHO)) as EchoBoxView;
  }

  async navToLogin() {
    return (await this.#navToView(View.LOGIN)) as LoginView;
  }

  async navToListDemo() {
    return (await this.#navToView(View.LIST)) as ListView;
  }
}
