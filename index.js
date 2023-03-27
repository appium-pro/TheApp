import {Navigation} from 'react-native-navigation';
import HomeScreen from './screens/HomeScreen.tsx';
import EchoScreen from './screens/EchoScreen.tsx';

Navigation.registerComponent('HomeScreen', () => HomeScreen);
Navigation.registerComponent('EchoScreen', () => EchoScreen);

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
