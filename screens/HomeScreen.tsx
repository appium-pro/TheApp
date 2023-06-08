import React, {useEffect, useState} from 'react';
import {View, Platform, ScrollView, Linking, Alert} from 'react-native';
import {ListItem} from '@rneui/base';
import {ScreenProps, testProps} from '../lib/utils';
import {login, navigate} from '../lib/utils';

const viewList = [
  {
    name: 'Echo Box',
    desc: 'Write something and save to local memory',
    screen: 'Echo',
  },
  {
    name: 'Login Screen',
    desc: 'A fake login screen for testing',
    screen: 'Login',
  },
  {
    name: 'Clipboard Demo',
    desc: 'Mess around with the clipboard',
    screen: 'Clipboard',
  },
  {
    name: 'Webview Demo',
    desc: 'Explore the possibilities of hybrid apps',
    screen: 'Webview',
  },
  {
    name: 'Dual Webview Demo',
    desc: 'Automate apps with multiple webviews',
    screen: 'DualWebview',
  },
  {
    name: 'List Demo',
    desc: 'Scroll through a list of stuff',
    screen: 'List',
  },
  {
    name: 'Photo Demo',
    desc: 'Some photos with no distinguishing IDs',
    screen: 'Photo',
  },
  {
    name: 'Geolocation Demo',
    desc: 'See your current location',
    screen: 'Geolocation',
  },
  {
    name: 'Picker Demo',
    desc: 'Use some picker wheels for fun and profit',
    screen: 'Picker',
  },
];

if (Platform.OS === 'android') {
  viewList.push({
    name: 'Verify Phone Number',
    desc: 'A fake SMS auto-verification screen',
    screen: 'VerifySMS',
  });
}

async function handleDeepLink(url: string, componentId: string) {
  console.log(`handling deep link: ${url}`);
  const route = url.replace(/.*?:\/\//g, '');
  const [handler, ...parts] = route.split('/');
  if (handler === 'login') {
    const loggedIn = await login(parts[0], parts[1]);
    if (loggedIn) {
      navigate(componentId, 'SecretScreen');
    } else {
      Alert.alert(
        '',
        'Invalid login credentials, cannot deep link to secret screen',
      );
    }
  }
}

function useInitialUrl() {
  const [url, setUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      setUrl(initialUrl);
      setProcessing(false);
    };

    getUrlAsync();
  }, []);

  return {url, processing};
}

export default function HomeScreen({componentId}: ScreenProps) {
  const {url: initialUrl} = useInitialUrl();

  // handle deep links
  useEffect(() => {
    // check if we launched the app with a deep link
    if (initialUrl) {
      handleDeepLink(initialUrl, componentId);
    }

    // also listen for links that occur while the app is already running
    Linking.addEventListener('url', ({url}) => {
      handleDeepLink(url, componentId);
    });
  }, [componentId, initialUrl]);

  return (
    <ScrollView>
      <View>
        {viewList.map((l, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() => navigate(componentId, `${l.screen}Screen`)}
            {...testProps(l.name)}>
            <ListItem.Content>
              <ListItem.Title>{l.name}</ListItem.Title>
              <ListItem.Subtitle>{l.desc}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))}
      </View>
    </ScrollView>
  );
}

HomeScreen.options = {topBar: {title: {text: 'TheApp'}}};
