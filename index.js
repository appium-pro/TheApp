import {Navigation} from 'react-native-navigation';
import HomeScreen from './screens/HomeScreen.tsx';

Navigation.registerComponent('HomeScreen', () => HomeScreen);
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
