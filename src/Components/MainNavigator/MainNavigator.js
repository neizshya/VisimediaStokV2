import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../../../Pages/Login';
import {Feather, AntDesign} from '@expo/vector-icons';

import {TouchableOpacity, View} from 'react-native';
import Header from '../Header/Header';
import AddManual from '../../../Pages/add items/AddManual';
import AddQr from '../../../Pages/add items/AddQr';
import ItemDetail from '../../../Pages/ItemDetail';

import QrItems from '../../../Pages/QrItems';
import ResetPassword from '../../../Pages/ResetPassword';
const Stack = createStackNavigator();

const StackNavigator = ({isDataLoaded}) => {
  const navigation = useNavigation();
  const config = {
    animation: 'timing',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <Stack.Navigator initialRouteName={isDataLoaded ? 'Header' : 'Login'}>
      <Stack.Screen
        name="Header"
        component={Header}
        options={{headerShown: false}}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="AddManual"
        component={AddManual}
        options={{
          headerBackImage: () => <Feather name="x" size={30} color="white" />,
          headerStyle: {
            backgroundColor: '#5689c0',
          },
          transitionSpec: {
            open: config,
            close: config,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Tambah barang',
          gestureDirection: 'vertical',
          cardStyleInterpolator: ({current, layouts}) => {
            return {
              containerStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen
        name="AddQr"
        component={AddQr}
        options={{
          headerBackImage: () => <Feather name="x" size={30} color="white" />,
          headerStyle: {
            backgroundColor: '#5689c0',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Scan QR Code',
          gestureDirection: 'vertical',
          cardStyleInterpolator: ({current, layouts}) => {
            return {
              containerStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={({route}) => ({
          headerStyle: {
            backgroundColor: '#5689c0',
          },
          transitionSpec: {
            open: config,
            close: config,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: `Loading`,

          headerRight: () => (
            <View style={{paddingRight: 20}}>
              <TouchableOpacity
                onPress={() => {
                  // here's onpress navigation to qritems
                  navigation.navigate('QrItems', {
                    itemId: route.params.itemId, // Pass the itemId to the QrItems screen if needed
                  });
                }}>
                <AntDesign name="qrcode" size={20} color="#FFFF" />
              </TouchableOpacity>
            </View>
          ),
          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({current, layouts}) => {
            return {
              containerStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        })}
      />
      <Stack.Screen
        name="QrItems"
        component={QrItems}
        options={({route}) => ({
          headerStyle: {
            backgroundColor: '#5689c0',
          },
          transitionSpec: {
            open: config,
            close: config,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },

          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({current, layouts}) => {
            return {
              containerStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        })}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={({route}) => ({
          headerStyle: {
            backgroundColor: '#5689c0',
          },
          transitionSpec: {
            open: config,
            close: config,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          title: 'Ganti Password',
          gestureDirection: 'horizontal',
          cardStyleInterpolator: ({current, layouts}) => {
            return {
              containerStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        })}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
