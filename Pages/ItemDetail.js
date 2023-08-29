import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  TextInput,
} from 'react-native-paper';
import TambahBarangModal from '../src/Components/TambahBarangModal';
import KurangiBarangModal from '../src/Components/KurangiBarangModal';
import {firestore} from '../config/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {UserContext} from '../context/UserContext';
import {ScrollView} from 'react-native-gesture-handler';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ItemDetail = ({route}) => {
  const {loggedInUserData} = useContext(UserContext);
  const {itemId} = route.params;
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [barang, setBarang] = useState({
    id: '',
    item_name: '',
    qty: '',
  });
  const [isLoadingSaving, setIsLoadingSaving] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [tambahModalVisible, setTambahModalVisible] = useState(false);
  const [kurangiModalVisible, setKurangiModalVisible] = useState(false);

  const fetchItem = async () => {
    try {
      const itemCollectionRef = collection(firestore, 'items');
      const itemDocRef = doc(itemCollectionRef, itemId);
      const itemDocSnapshot = await getDoc(itemDocRef);
      if (itemDocSnapshot.exists()) {
        setSelectedItem({
          id: itemDocSnapshot.id,
          ...itemDocSnapshot.data(),
        });
        setBarang({
          id: itemDocSnapshot.id,
          item_name: itemDocSnapshot.data().item_name,
          qty: itemDocSnapshot.data().qty,
        });
        navigation.setOptions({title: itemDocSnapshot.data().item_name});
      } else {
        console.log('Item not found.');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching item data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [itemId, navigation]);

  const handleEditPress = () => {
    setIsEdit(!isEdit);
    if (!isEdit) {
      setBarang({
        id: selectedItem ? selectedItem.id : '',
        item_name: selectedItem ? selectedItem.item_name : '',
        qty: selectedItem ? selectedItem.qty : '',
      });
    }
  };

  const handleSavePress = async () => {
    setIsLoadingSaving(true);
    try {
      const docRef = doc(firestore, `items/${selectedItem.id}`);
      await updateDoc(docRef, {
        item_name: barang.item_name,
      });

      await setDoc(docRef, {id: selectedItem.id}, {merge: true});

      setIsLoadingSaving(false);
      setIsEdit(true);
      navigation.navigate('Items');
    } catch (error) {
      console.error('Error updating document:', error);
      setIsLoadingSaving(false);
      setIsEdit(true);
    }
  };

  const handleKurangiPress = () => {
    setKurangiModalVisible(true);
  };

  const handleKurangiSave = async data => {
    try {
      if (!data.quantity || isNaN(parseInt(data.quantity))) {
        return;
      }

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newQuantity = selectedItem.qty - parseInt(data.quantity);
      if (newQuantity >= 0) {
        await updateDoc(doc(firestore, `items/${selectedItem.id}`), {
          qty: newQuantity,
        });
        await addDoc(collection(firestore, `history`), {
          name: selectedItem.item_name,
          date: moment(data.date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
          nota: data.nota,
          person: data.sender,
          Tipe: 'out',
          add_minus: parseInt(data.quantity),
          qty: newQuantity,
        });
        await fetchItem();
        setIsLoading(false);
        setKurangiModalVisible(false);
      } else {
        console.log('Cannot reduce beyond zero');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error updating document:', error);
      setIsLoading(false);
    }
  };

  const handleTambahPress = () => {
    setTambahModalVisible(true);
  };
  const handleTambahSave = async data => {
    try {
      if (!data.quantity || isNaN(parseInt(data.quantity))) {
        return;
      }

      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newQuantity = selectedItem.qty + parseInt(data.quantity);

      await updateDoc(doc(firestore, `items/${selectedItem.id}`), {
        qty: newQuantity,
      });

      await addDoc(collection(firestore, `history`), {
        name: selectedItem.item_name,
        date: moment(data.date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
        nota: data.nota,
        person: data.sender,
        Tipe: 'in',
        add_minus: parseInt(data.quantity),
        qty: newQuantity,
      });

      await fetchItem();
      setIsLoading(false);
      setTambahModalVisible(false);
    } catch (error) {
      console.error('Error updating document:', error);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    try {
      if (selectedItem) {
        await deleteDoc(doc(firestore, `items/${selectedItem.id}`));
        setIsLoadingDelete(false);
        Alert.alert('Data berhasil dihapus');
        navigation.navigate('Items');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      Alert.alert(`Data gagal dihapus : ${error.message}`);
      setIsLoadingDelete(false);
    }
  };

  return (
    <>
      <ScrollView>
        {isLoading ? (
          <>
            <ActivityIndicator animating={true} />
          </>
        ) : (
          <View style={styles.container}>
            <View style={styles.imgContainer}>
              <Image
                source={
                  selectedItem?.item_img
                    ? {uri: selectedItem?.item_img}
                    : require('../src/images/defaultitem.png')
                }
                style={styles.image}
              />
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.idBarangContainer}>
                <Text style={styles.label}>ID Barang:</Text>
                <TextInput
                  value={String(barang.id)}
                  onChangeText={text => SetBarang({...barang, id: text})}
                  style={styles.data}
                  disabled={isEdit}
                />
              </View>
              <View style={styles.namaBarangContainer}>
                <Text style={styles.label}>Nama Barang:</Text>
                <TextInput
                  value={barang.item_name}
                  onChangeText={text => SetBarang({...barang, item_name: text})}
                  style={styles.data}
                  disabled={isEdit}
                />
                {loggedInUserData.userData.isAdmin === false ? (
                  <></>
                ) : isEdit ? (
                  <>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={handleEditPress}>
                      <Text style={styles.editButtonText}>Edit Data</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Button
                        style={styles.editedButton}
                        onPress={handleEditPress}>
                        <Text style={styles.editButtonText}>Batal</Text>
                      </Button>
                      <Button
                        style={styles.editedButton}
                        onPress={handleSavePress}
                        loading={isLoadingSaving}>
                        <Text style={styles.editButtonText}>Simpan</Text>
                      </Button>
                    </View>
                  </>
                )}
              </View>
            </View>
            <View style={styles.jumlahContainer}>
              <Text style={styles.label}>Jumlah:</Text>
              <Text style={styles.qtyText}>{selectedItem?.qty}</Text>
              {loggedInUserData.userData.isAdmin === false ? (
                <></>
              ) : (
                <View style={styles.jumlahButton}>
                  <TouchableOpacity
                    style={styles.kurangiTambahButton}
                    onPress={handleKurangiPress}>
                    <Text style={styles.kurangiTambahButtonText}>
                      Kurangi Barang
                    </Text>
                  </TouchableOpacity>
                  <KurangiBarangModal
                    visible={kurangiModalVisible}
                    onClose={() => setKurangiModalVisible(false)}
                    item={selectedItem}
                    onSave={handleKurangiSave}
                  />
                  <TouchableOpacity
                    style={styles.kurangiTambahButton}
                    onPress={handleTambahPress}>
                    <Text style={styles.kurangiTambahButtonText}>
                      Tambah Barang
                    </Text>
                  </TouchableOpacity>
                  <TambahBarangModal
                    visible={tambahModalVisible}
                    onClose={() => setTambahModalVisible(false)}
                    item={selectedItem}
                    onSave={handleTambahSave}
                  />
                </View>
              )}
            </View>
            {loggedInUserData.userData.isAdmin === false ? (
              <></>
            ) : (
              <Button
                style={styles.deleteButton}
                onPress={() => setVisible(true)}
                loading={isLoadingDelete}>
                <Text style={styles.deleteButtonText}>Hapus</Text>
              </Button>
            )}
          </View>
        )}
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title>Hapus {barang.item_name}?</Dialog.Title>
          <Dialog.Content>
            <Text>Apakah anda yakin akan menghapus barang tersebut?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} textColor="blue">
              Tidak
            </Button>
            <Button
              onPress={handleDelete}
              textColor="red"
              loading={isLoadingDelete}>
              Ya
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fafafa',
    paddingVertical: 20,
    paddingBottom: screenHeight * 0.34,
  },
  imgContainer: {
    flex: 1,
    alignItems: 'center',
    elevation: 3,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 16,
  },
  infoContainer: {
    flex: 1,
    marginBottom: 8,
    marginTop: 24,
  },
  idBarangContainer: {
    marginBottom: 12,
  },
  namaBarangContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    color: 'black',
  },
  data: {
    fontSize: 18,
    fontWeight: '400',
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    paddingVertical: 4,
    backgroundColor: '#eaebed',
    height: 30,
  },
  jumlahContainer: {
    flex: 1,
  },
  editButton: {
    backgroundColor: '#5689c0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
  },
  editedButton: {
    backgroundColor: '#5689c0',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
    width: screenWidth * 0.4,
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  qtyText: {
    backgroundColor: '#eaebed',
    fontSize: 18,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 4,
    textAlign: 'center',
    paddingVertical: 4,
    color: 'black',
  },
  jumlahButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: screenHeight * 0.1,
  },
  kurangiTambahButton: {
    width: 170,
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
    marginTop: 4,
  },
  kurangiTambahButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 3,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ItemDetail;
