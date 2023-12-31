import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';

import {UserContext, useUserState} from './context/UserContext';
import StackNavigator from './src/Components/MainNavigator/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';

export default function App() {
  const userState = useUserState();
  const {isDataLoaded} = useUserState();
  return (
    <PaperProvider>
      <UserContext.Provider value={userState}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StackNavigator isDataLoaded={isDataLoaded} />
          </NavigationContainer>
        </SafeAreaProvider>
      </UserContext.Provider>
    </PaperProvider>
  );
}
