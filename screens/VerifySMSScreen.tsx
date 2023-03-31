import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, View, StyleSheet, Text, Alert} from 'react-native';
import {testProps} from '../lib/utils';
import SMSListener from '@ernestbies/react-native-android-sms-listener';

const CODE = '123456';

async function requestReadSmsPermission() {
  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS, {
    title: 'SMS Read Verification',
    message: 'We need access to read SMS to verify your authorization',
    buttonPositive: 'Grant',
  });
  await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
    title: 'SMS Receipt Verification',
    message: 'We need access to receive SMS to verify your authorization',
    buttonPositive: 'Grant',
  });
}

interface SMSMessage {
  originatingAddress: string;
  body: string;
  timestamp: number;
}

interface CancellableSubscription {
  remove?: () => void;
}

export default function VerifySMSScreen() {
  const [isVerified, setIsVerified] = useState<boolean>(false);

  useEffect(() => {
    let smsListener: CancellableSubscription = {};
    requestReadSmsPermission().catch((err: any) => Alert.alert('Error', err));
    smsListener = SMSListener.addListener((message: SMSMessage) => {
      if (new RegExp(CODE).test(message.body)) {
        setIsVerified(true);
      }
    });
    return function cleanup() {
      if (smsListener.remove) {
        smsListener.remove();
        smsListener = {};
      }
    };
  });

  return (
    <View style={styles.main}>
      {isVerified && (
        <Text style={styles.message} {...testProps('verified')}>
          You&apos;ve been verified!
        </Text>
      )}
      {!isVerified && (
        <Text style={styles.message} {...testProps('waiting')}>
          Waiting to receive a verification text message with the correct code.
          (HINT: it&apos;s {CODE})
        </Text>
      )}
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
