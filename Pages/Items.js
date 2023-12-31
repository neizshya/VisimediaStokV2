import {useCallback, useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import FloatingButton from '../src/Components/FloatingButton';
import {UserContext} from '../context/UserContext';
import {ActivityIndicator} from 'react-native-paper';

import {firestore} from '../config/firebase';
import {collection, getDocs} from 'firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

export default function ItemsScreen({navigation}) {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const {loggedInUserData, searchQuery} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsData, setItemsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFAB, setShowFAB] = useState(true);
  const fetchItems = async () => {
    try {
      const itemsCollectionRef = collection(firestore, 'items');
      const querySnapshot = await getDocs(itemsCollectionRef);

      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredItems = items.filter(item =>
        item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setItemsData(filteredItems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching items data:', error);
      setIsLoading(false);
    }
  };

  const refreshItemsData = async () => {
    setIsLoading(true);
    setCurrentPage(1);
    setItemsData([]);
    await fetchItems();
  };
  useEffect(() => {
    fetchItems();
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setShowFAB(false);
    });

    const unsubscribeFocus = navigation.addListener('focus', () => {
      setShowFAB(true);
    });

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      refreshItemsData();
      return () => {};
    }, [searchQuery]),
  );

  return (
    <>
      <View
        style={{
          backgroundColor: '#fafafa',
        }}>
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 12,
            height: screenHeight * 0.9,
          }}>
          <SafeAreaView>
            {isLoading ? (
              <View
                style={{
                  height: screenHeight,
                  justifyContent: 'center',
                  alignContent: 'center',
                }}>
                <ActivityIndicator
                  animating={true}
                  color="#5689c0"
                  size={'large'}
                />
              </View>
            ) : itemsData.length !== 0 ? (
              <FlatList
                data={itemsData}
                keyExtractor={item => item.id}
                renderItem={({item}) => {
                  return (
                    <>
                      <TouchableOpacity
                        style={{}}
                        onPress={() => {
                          navigation.navigate('ItemDetail', {
                            itemId: item.id,
                          });
                        }}>
                        <View
                          style={{
                            backgroundColor: '#75e2ff',
                            flexDirection: 'row',
                            paddingVertical: 16,
                            paddingHorizontal: 16,
                            borderRadius: 12,
                            marginTop: 12,
                            elevation: 2,
                          }}>
                          <Image
                            style={{height: 100, width: 100, borderRadius: 8}}
                            source={{uri: item.item_img}}
                          />
                          <View
                            style={{
                              flexDirection: 'column',
                              paddingLeft: 16,
                            }}>
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'black',
                                flexWrap: 'wrap',
                                flexShrink: 1,
                                width: screenWidth - 180,
                              }}>
                              {item.item_name}
                            </Text>
                            <View
                              style={{flexDirection: 'row', paddingTop: 12}}>
                              <Text style={{fontSize: 16, color: 'black'}}>
                                Jumlah:{' '}
                              </Text>
                              <Text style={{fontSize: 16, color: 'black'}}>
                                {item.qty}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </>
                  );
                }}
              />
            ) : (
              <>
                <View
                  style={{
                    height: screenHeight,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 20, color: 'black'}}>
                    Tidak Ada data
                  </Text>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
        {isLoading ? (
          <></>
        ) : (
          <>
            {loggedInUserData.userData.isAdmin && showFAB ? (
              <>
                <FloatingButton
                  onpressManual={() => {
                    navigation.navigate('AddManual');
                  }}
                  onPressQr={() => {
                    navigation.navigate('AddQr');
                  }}
                />
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </View>
    </>
  );
}
