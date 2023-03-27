import {Navigation} from 'react-native-navigation';
import HomeScreen from './screens/HomeScreen.tsx';
import EchoScreen from './screens/EchoScreen.tsx';
import LoginScreen from './screens/LoginScreen.tsx';
import SecretScreen from './screens/SecretScreen.tsx';

Navigation.registerComponent('HomeScreen', () => HomeScreen);
Navigation.registerComponent('EchoScreen', () => EchoScreen);
Navigation.registerComponent('LoginScreen', () => LoginScreen);
Navigation.registerComponent('SecretScreen', () => SecretScreen);

Navigation.events().registerAppLaunchedListener(async () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: 'HomeScreen',
            },
          },
        ],
      },
    },
  });
});
