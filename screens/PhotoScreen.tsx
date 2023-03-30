import React from 'react';
import {shuffle} from 'lodash';
import {
  Dimensions,
  TouchableHighlight,
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {ImageRequireSource} from 'react-native';

const PHOTOS = [
  '2 tanker ships with snowy mountains in the background',
  'Wispy clouds in a blue sky',
  'English bay with snowy mountains',
  'The Vancouver skyline at sunrise',
  'A long thin cloud below mountain level',
  'Imposing mountains and West Vancouver',
];

const SOURCES: ImageRequireSource[] = [
  require('../img/hero-1-small.jpg'),
  require('../img/hero-2-small.jpg'),
  require('../img/hero-3-small.jpg'),
  require('../img/hero-4-small.jpg'),
  require('../img/hero-5-small.jpg'),
  require('../img/hero-6-small.jpg'),
];

let ZIPPED: [string, ImageRequireSource][] = [];
for (let i = 0; i < PHOTOS.length; i++) {
  ZIPPED[i] = [PHOTOS[i], SOURCES[i]];
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  listHeader: {
    padding: 8,
    fontSize: 14,
  },
  hero: {
    width: screenWidth / 2.5,
    height: screenWidth / 2.5,
    margin: screenWidth / 30,
  },
  imgCont: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default function ListScreen() {
  ZIPPED = shuffle(ZIPPED);

  function showPhotoMsg(photo: number) {
    Alert.alert('Selected Photo', `This is a picture of: ${ZIPPED[photo][0]}`);
  }

  function photoImages() {
    let images = [];
    for (let i = 0; i < ZIPPED.length; i++) {
      images.push(
        <TouchableHighlight key={`photo${i}`} onPress={() => showPhotoMsg(i)}>
          <Image resizeMode="cover" style={styles.hero} source={ZIPPED[i][1]} />
        </TouchableHighlight>,
      );
    }
    return <View style={styles.imgCont}>{images}</View>;
  }

  return (
    <ScrollView>
      <Text style={styles.listHeader}>Photo Library. Tap a photo!</Text>
      {photoImages()}
    </ScrollView>
  );
}
