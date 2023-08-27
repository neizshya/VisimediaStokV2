import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import TextInputKeren from '../src/Components/TextInput';
import LoginButtons from '../src/Components/LoginButton';

import {UserContext} from '../context/UserContext';
import {AntDesign} from '@expo/vector-icons';
import {ScrollView} from 'react-native-gesture-handler';
const colors = {
  primary: '#5689c0',
  secondary: '#75e2ff',
  caption: '#244d61',
  caption2: '#ffffff',
};
export default function Login({navigation}) {
  const {
    HandlePressLogin,
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    isDataLoaded,
  } = useContext(UserContext);

  useEffect(() => {
    if (isDataLoaded) {
      navigation.replace('Header');
    }
  }, [isDataLoaded]);

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <StatusBar backgroundColor={colors.primary} barStyle="dark-content" />
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require('../src/images/lgn.png')}
            />
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTextBold}>Selamat Datang,</Text>
              <Text style={styles.welcomeTextRegular}>
                silahkan login untuk mulai mengakses data
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.formContainer}>
          <TextInputKeren
            state={email.replace('@gmail.com', '')}
            set={text => {
              setEmail(text + '@gmail.com');
            }}
            icon={<AntDesign name="user" size={24} color="#900" />}
            placeholder="Masukan username"
            isPassword={false}
          />
          <TextInputKeren
            state={password}
            set={setPassword}
            icon={<AntDesign name="lock" size={24} color="#900" />}
            placeholder="Masukan password"
            isPassword={true}
          />

          <LoginButtons
            loading={isLoading}
            text="Login"
            onPressHandle={() => {
              HandlePressLogin(navigation);
            }}
            disabled={!email || !password}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    elevation: 5,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 250,
    width: 250,
  },
  welcomeText: {
    alignItems: 'flex-start',
    paddingBottom: 30,
  },
  welcomeTextBold: {
    fontSize: 24,
    color: colors.caption2,
    fontWeight: 'bold',
  },
  welcomeTextRegular: {
    fontSize: 20,
    color: colors.caption2,
    paddingTop: 12,
    paddingEnd: 120,
  },
  formContainer: {
    marginTop: 20,
    flex: 1,
  },
  bottomContainer: {
    paddingBottom: 10,
  },
  infoText: {
    borderRadius: 10,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    elevation: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
  },
});
