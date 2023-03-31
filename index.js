import {Navigation} from 'react-native-navigation';
import HomeScreen from './screens/HomeScreen.tsx';
import EchoScreen from './screens/EchoScreen.tsx';
import LoginScreen from './screens/LoginScreen.tsx';
import SecretScreen from './screens/SecretScreen.tsx';
import ClipboardScreen from './screens/ClipboardScreen.tsx';
import WebviewScreen from './screens/WebviewScreen.tsx';
import DualWebviewScreen from './screens/DualWebviewScreen.tsx';
import ListScreen from './screens/ListScreen.tsx';
import PhotoScreen from './screens/PhotoScreen.tsx';
import GeolocationScreen from './screens/GeolocationScreen.tsx';
import PickerScreen from './screens/PickerScreen.tsx';
import VerifySMSScreen from './screens/VerifySMSScreen.tsx';

Navigation.registerComponent('HomeScreen', () => HomeScreen);
Navigation.registerComponent('EchoScreen', () => EchoScreen);
Navigation.registerComponent('LoginScreen', () => LoginScreen);
Navigation.registerComponent('SecretScreen', () => SecretScreen);
Navigation.registerComponent('ClipboardScreen', () => ClipboardScreen);
Navigation.registerComponent('WebviewScreen', () => WebviewScreen);
Navigation.registerComponent('DualWebviewScreen', () => DualWebviewScreen);
Navigation.registerComponent('ListScreen', () => ListScreen);
Navigation.registerComponent('PhotoScreen', () => PhotoScreen);
Navigation.registerComponent('GeolocationScreen', () => GeolocationScreen);
Navigation.registerComponent('PickerScreen', () => PickerScreen);
Navigation.registerComponent('VerifySMSScreen', () => VerifySMSScreen);

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
