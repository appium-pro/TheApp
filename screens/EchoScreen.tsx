import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button} from '@rneui/base';
import {base as baseStyles} from '../lib/styles';
import {testProps} from '../lib/utils';

const ECHO_KEY = '@TheApp:savedAwesomeText';
const OLD_ECHO_KEY = '@TheApp:savedEcho';

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  echoHeader: {
    fontSize: baseStyles.fontSizeMed,
    margin: baseStyles.margin,
  },
  savedEcho: {
    margin: baseStyles.margin,
    color: '#999',
    fontSize: baseStyles.fontSizeBig,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
  },
  formControl: {
    margin: baseStyles.margin,
    width: '100%',
    height: 50,
  },
});

export default function EchoScreen() {
  const [savedEcho, setSavedEcho] = useState<string | null>(null);
  const [curText, setCurText] = useState<string | null>(null);

  async function setEcho() {
    let _savedEcho = await AsyncStorage.getItem(ECHO_KEY);
    // do a key migration if the user had the old version and is upgrading
    if (!savedEcho) {
      const oldSavedEcho = await AsyncStorage.getItem(OLD_ECHO_KEY);
      if (oldSavedEcho) {
        _savedEcho = oldSavedEcho;
        await AsyncStorage.setItem(ECHO_KEY, _savedEcho);
      }
    }
    setSavedEcho(_savedEcho);
  }

  async function saveEcho() {
    if (!curText) {
      throw new Error('Must enter text');
    }

    await AsyncStorage.setItem(ECHO_KEY, curText);
    await setEcho();
  }

  useEffect(() => {
    (async () => {
      await setEcho();
    })();
  });

  const placeholder = `Say something${savedEcho ? ' new' : ''}`;
  return (
    <View style={styles.main}>
      {savedEcho && (
        <View style={{...baseStyles.flexCenter}}>
          <Text style={styles.echoHeader}>
            Here&apos;s what you said before:
          </Text>
          <Text
            style={styles.savedEcho}
            testID="savedMessage"
            accessibilityLabel={savedEcho}>
            {savedEcho}
          </Text>
        </View>
      )}
      <View style={styles.form}>
        <Input
          placeholder={placeholder}
          style={styles.formControl}
          onChangeText={text => setCurText(text)}
          {...testProps('messageInput')}
        />
        <Button
          title="Save"
          style={styles.formControl}
          onPress={saveEcho}
          {...testProps('messageSaveBtn')}
        />
      </View>
    </View>
  );
}

EchoScreen.options = {topBar: {title: {text: 'Echo Screen'}}};
