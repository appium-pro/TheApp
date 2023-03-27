import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {Button, Text} from '@rneui/base';
import {base as baseStyles} from '../lib/styles';
import {testProps, getLoginUser, logout, ScreenProps} from '../lib/utils';

export default function SecretScreen({componentId}: ScreenProps) {
  const [user, setUser] = useState('');

  useEffect(() => {
    (async () => {
      const loginUser = await getLoginUser();
      if (!loginUser) {
        Navigation.pop(componentId);
        return;
      }

      setUser(loginUser);
    })();
  }, [user, componentId]);

  async function doLogout() {
    await logout();
    Navigation.pop(componentId);
  }

  return (
    <View style={styles.view}>
      <Text h2>Secret Area</Text>
      <Text style={styles.message}>
        You are logged in as{' '}
        <Text style={styles.username} {...testProps(`Logged in as ${user}`)}>
          {user}
        </Text>
      </Text>
      <Button title="Logout" onPress={doLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: baseStyles.margin * 5,
  },
  message: {
    marginTop: baseStyles.margin * 2,
    marginBottom: baseStyles.margin * 2,
  },
  username: {
    fontWeight: 'bold',
  },
});
