import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import WebView from 'react-native-webview';
import {WebViewSource} from 'react-native-webview/lib/WebViewTypes';
import {Input, Button} from '@rneui/base';
import {base as baseStyles} from '../lib/styles';
import {testProps} from '../lib/utils';

export default function WebviewScreen() {
  const [url, setUrl] = useState<string | null>(null);
  const [urlInField, setUrlInField] = useState<string | null>(null);
  const [urlElement, setUrlElement] = useState<Input | null>(null);
  const initialHtml = `
    <html>
      <body>
        <center><h1 style="font-size: 50px;">Please navigate to a webpage</h1></center>
      </body>
    </html>
  `;

  let source: WebViewSource = {html: initialHtml};
  if (url) {
    if (!/^https:\/\/appiumpro.com$/i.test(url)) {
      Alert.alert('Sorry, you are not allowed to visit that url');
    } else {
      source = {uri: url};
    }
  }

  return (
    <View style={styles.main}>
      <Input
        ref={(input: any) => {
          setUrlElement(input as Input);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="https://appiumpro.com"
        onChangeText={(url: string) => {
          setUrlInField(url);
          setUrl(null);
        }}
        {...testProps('urlInput')}
      />
      <Button
        title="Go"
        style={styles.formControl}
        onPress={() => setUrl(urlInField)}
        {...testProps('navigateBtn')}
      />
      <Button
        title="Clear"
        style={styles.formControl}
        onPress={() => {
          if (urlElement) {
            urlElement.clear();
          }
        }}
        {...testProps('clearBtn')}
      />
      <WebView style={styles.webview} originWhitelist={['*']} source={source} />
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
  formControl: {
    margin: baseStyles.margin,
    width: '100%',
    height: 40,
  },
  webview: {
    height: 200,
    width: 400,
    marginTop: 25,
  },
});
