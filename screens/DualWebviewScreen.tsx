import React from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

export default function DualWebviewScreen() {
  function initialHtml(webviewName: string) {
    return `
      <html>
        <body>
          <center><h2 style="font-size: 50px;">This is webview '${webviewName}'</h2></center>
        </body>
      </html>
    `;
  }

  const source1 = {html: initialHtml('1')};
  const source2 = {html: initialHtml('2')};

  return (
    <View style={styles.main}>
      <WebView style={styles.webview} source={source1} />
      <WebView style={styles.webview} source={source2} />
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
    width: '100%',
  },
  webview: {
    width: 300,
    marginTop: 25,
  },
});
