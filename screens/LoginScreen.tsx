import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button, Text} from '@rneui/base';
import {base as baseStyles} from '../lib/styles';
import {navigate, testProps, USER_KEY, login, ScreenProps} from '../lib/utils';

const SECRET_SCREEN = 'SecretScreen';

export default function EchoScreen({componentId}: ScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    (async () => {
      // if we're already logged in, just go to the secret area already
      if (await AsyncStorage.getItem(USER_KEY)) {
        navigate(componentId, SECRET_SCREEN);
      }
    })();
  }, [componentId]);

  async function doLogin() {
    if (await login(username, password)) {
      setUsername('');
      setPassword('');
      navigate(componentId, SECRET_SCREEN);
      return;
    }

    Alert.alert('', 'Invalid login credentials, please try again');
  }

  return (
    <View style={styles.loginView}>
      <Text h2>Login</Text>
      <Input
        placeholder="Username"
        style={styles.formEl}
        onChangeText={setUsername}
        autoCapitalize="none"
        value={username}
        {...testProps('username')}
      />
      <Input
        placeholder="Password"
        style={styles.formEl}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry={true}
        value={password}
        {...testProps('password')}
      />
      <Button
        title="Login"
        style={styles.button}
        onPress={doLogin}
        {...testProps('loginBtn')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loginView: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: baseStyles.margin * 5,
  },
  formEl: {
    height: 50,
    marginTop: baseStyles.margin * 2,
    width: '90%',
  },
  button: {
    marginTop: baseStyles.margin * 2,
    width: '90%',
  },
});
