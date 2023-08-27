import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {FAB, Portal} from 'react-native-paper';

const FloatingButton = ({onpressManual, onPressQr}) => {
  const [fabOpen, setFabOpen] = useState({open: false});

  const onStateChange = ({open}) => setFabOpen({open});

  const {open} = fabOpen;
  return (
    <Portal>
      <FAB.Group
        fabStyle={styles.circle}
        open={open}
        visible
        icon={open ? 'cancel' : 'plus'}
        color="white"
        actions={[
          {
            icon: 'plus',
            label: 'Tambah Barang',
            onPress: onpressManual,
            style: {
              backgroundColor: '#5689c0',
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            },
            color: 'white',
          },
          {
            icon: 'qrcode-scan',
            label: 'QRCode Scan',
            onPress: onPressQr,
            style: {
              backgroundColor: '#5689c0',
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            },
            color: 'white',
          },
        ]}
        onStateChange={onStateChange}
      />
    </Portal>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  circle: {
    backgroundColor: '#5689c0',
    width: 60,
    height: 60,

    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
