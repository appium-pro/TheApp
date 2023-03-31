import React, {useState, useEffect} from 'react';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';
import B from 'bluebird';
import {
  Platform,
  Alert,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Read Verification',
        message:
          'We need access to read geolocation data so we can show that data to you',
        buttonPositive: 'Grant Access',
      },
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      throw new Error('Could not get geolocation permission');
    }
  } else {
    const authRes = await Geolocation.requestAuthorization('whenInUse');
    if (authRes !== 'granted') {
      throw new Error('Could not get geolocation permission');
    }
  }
}

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export default function GeolocationScreen() {
  const [curLoc, setCurLoc] = useState<Location>({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
  });
  const [watchId, setWatchId] = useState<number>(0);

  function onPositionUpdate(loc: GeoPosition) {
    setCurLoc(loc.coords);
  }

  const onErr = (err: any) => {
    Alert.alert(err.message);
  };

  useEffect(() => {
    async function effect() {
      try {
        await requestLocationPermission();

        if (Platform.OS === 'android') {
          await B.delay(500); // wait a bit for android to know we can get position
        }

        Geolocation.getCurrentPosition(onPositionUpdate, onErr);
        setWatchId(Geolocation.watchPosition(onPositionUpdate, onErr));
      } catch (err) {
        onErr(err);
      }
    }

    effect();

    return function cleanup() {
      Geolocation.clearWatch(watchId);
    };
  });

  const {latitude, longitude, accuracy} = curLoc;
  return (
    <View style={styles.main}>
      <Text style={styles.message}>Latitude: {latitude}</Text>
      <Text style={styles.message}>Longitude: {longitude}</Text>
      <Text style={styles.message}>Accuracy: {accuracy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  message: {
    padding: 20,
  },
});
