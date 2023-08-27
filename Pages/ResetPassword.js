import React, {useState} from 'react';
import {Text, View, Alert} from 'react-native';

import {Button, TextInput} from 'react-native-paper';

import {auth} from '../config/firebase';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
export default function ResetPassword({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newSecondPassword, setNewSecondPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const isStrongPassword = password => {
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasLetter && hasNumber;
  };

  const handleOnPress = async () => {
    try {
      if (newPassword !== newSecondPassword) {
        Alert.alert('Password baru tidak sama');
        return;
      }

      if (!isStrongPassword(newPassword)) {
        Alert.alert(
          'Password minimal 8 karakter, memilikia huruf, dan juga angka',
        );
        return;
      }

      setIsLoading(true);

      const user = auth.currentUser;

      if (user) {
        const credential = EmailAuthProvider.credential(
          user.email,
          oldPassword,
        );

        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);

        setIsLoading(false);

        console.log('Password changed successfully');
        Alert.alert('Password berhasil diubah');
        navigation.navigate('Account');
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error changing password', error.message);
    }
  };
  return (
    <SafeAreaView style={{alignContent: 'center', justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 15}}>
        <View style={{marginVertical: 10}}>
          <Text>Masukan password lama</Text>
          <TextInput
            secureTextEntry={true}
            mode="outlined"
            style={{height: 30}}
            value={oldPassword}
            onChangeText={text => setOldPassword(text)}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <Text>Masukan password baru</Text>
          <TextInput
            secureTextEntry={true}
            mode="outlined"
            style={{height: 30}}
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <Text>Masukan kembali password baru</Text>
          <TextInput
            secureTextEntry={true}
            mode="outlined"
            style={{height: 30}}
            value={newSecondPassword}
            onChangeText={text => setNewSecondPassword(text)}
          />
        </View>

        <Button
          mode="contained"
          style={{marginTop: 25, borderRadius: 10}}
          buttonColor="#5689c0"
          textColor="white"
          loading={isLoading}
          onPress={handleOnPress}
          disabled={!newPassword || !oldPassword || !newSecondPassword}>
          Ubah Password
        </Button>
      </View>
    </SafeAreaView>
  );
}
