import React from 'react';
import {View, Platform, ScrollView} from 'react-native';
import {ListItem} from '@rneui/base';
import {Navigation} from 'react-native-navigation';
import {ScreenProps, testProps} from '../lib/utils';

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
    screen: 'Hybrid',
  },
  {
    name: 'Dual Webview Demo',
    desc: 'Automate apps with multiple webviews',
    screen: 'Hybrid2',
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
    screen: 'Location',
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

export default function HomeScreen({componentId}: ScreenProps) {
  return (
    <ScrollView>
      <View>
        {viewList.map((l, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() =>
              Navigation.push(componentId, {
                component: {
                  name: `${l.screen}Screen`,
                },
              })
            }
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
