import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  View,
  Button,
  Toast,
  Text,
  Dialog,
} from 'react-native-ui-lib';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Clipboard from 'expo-clipboard';
import HelperStyles from '../styles/HelperStyles';
import styles from '../styles/GlobalStyles';

const BarcodeScannerView: FunctionComponent = () => {
  const [alertNotificationMessage, setAlertNotificationMessage] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [scannedOutput, setScannedOutput] = useState('');
  const [scanned, setScanned] = useState(false);
  const [isDialogShown, setIsDialogShown] = useState(false);

  const handleBarCodeScanned = ({ data }: {data: string}): void => {
    setScanned(true);
    setScannedOutput(data);
    setIsDialogShown(true);
  };

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <>
      <Toast
        visible={!!alertNotificationMessage}
        position="bottom"
        onDismiss={() => setAlertNotificationMessage('')}
        showDismiss
        backgroundColor="black"
        autoDismiss={5000}
        message={alertNotificationMessage}
      />

      <Dialog
        useSafeArea
        top
        panDirection="up"
        containerStyle={styles.dialog}
        visible={isDialogShown}
        onDismiss={() => setIsDialogShown(false)}
        renderPannableHeader={() => (
          <View>
            <View margin-20>
              <Text>Scanned successfully</Text>
            </View>
            <View height={2} bg-grey70 />
          </View>
        )}
      >
        <View style={[HelperStyles.paddingHorizontalBig, HelperStyles.paddingVerticalMed]}>
          <Text>{scannedOutput}</Text>

          <View style={[HelperStyles.row, HelperStyles.marginTopMed, { justifyContent: 'flex-end' }]}>
            <View marginR margin-10>
              <Button text70 label="Copy" link onPress={() => Clipboard.setString(scannedOutput)} />
            </View>

            <View>
              <Button marginR margin-10 text70 label="Done" link onPress={() => setIsDialogShown(false)} />
            </View>
          </View>
        </View>
      </Dialog>

      {(!hasPermission) && <Text style={HelperStyles.textCenter}>No access to camera</Text>}

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[styles.barcodeCameraFill]}
      >
        <>
          <View style={styles.barcodeCameraBody}>

            {/* {!scanned && (
              <View style={styles.scannerUpperContainer}>
                <View style={styles.scannerUpperLeft} />
                <View style={styles.scannerUpperRight} />
                <View style={styles.scannerLowerLeft} />
                <View style={styles.scannerLowerRight} />
              </View>
            )} */}

          </View>

          <View style={styles.barcodeCameraFooter}>
            <View style={HelperStyles['w-75']}>
              <Button
                disabled={!scanned}
                borderRadius={6}
                enableShadow
                label={!scanned ? 'Scanning' : 'Tap to Scan Again'}
                onPress={() => { setScanned(false); setScannedOutput(''); }}
              />
            </View>
          </View>
        </>
      </BarCodeScanner>
    </>
  );
};

export default BarcodeScannerView;
