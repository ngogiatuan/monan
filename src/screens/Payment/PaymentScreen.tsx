import React, { useContext, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { nav } from '../../navigation/navigationName';
import { getStatusPaymentZP, requestPaymentZP } from '../../api/payment';
import { UserContext } from '../../context/UserContext';
import { payOrderZalo } from '../../utils/zaloSDK';

const { width } = Dimensions.get('window');

const PAYMENT_METHODS = [
  {
    key: 'momo',
    label: 'Thanh toán bằng MoMo',
    icon: require('../../assert/image/momo.png'),
  },
  {
    key: 'zalopay',
    label: 'Thanh toán bằng Zalopay',
    icon: require('../../assert/image/zalopay.png'),
  },
  {
    key: 'card',
    label: 'Thanh toán bằng thẻ Tín dụng/Ghi nợ',
    icon: require('../../assert/image/paycard.png'),
  },
];

const PaymentScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const price = route.params?.price; // Get price from route params
  const selectedPackage = route.params?.selectedPackage; // Get selectedPackage from route params

  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useContext(UserContext);
  const [paymentProcessZP, setPaymentProcessZP] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentStatusZP = useCallback(async () => {
    if (!paymentProcessZP) return;
    try {
      const res = await getStatusPaymentZP(paymentProcessZP, user?.token);
      console.log('handle Payment status', res);
      if (res?.return_code === 1) {
        setShowSuccess(true);
        setPaymentProcessZP('');
      }
      if (res?.return_code === 2) {
        Alert.alert('Thanh toán thất bại!');
      }
    } catch (err) {
      console.log('Handle Payment ZP: ', err);
    } finally {
      setIsLoading(false);
    }
  }, [paymentProcessZP, user]);

  useEffect(() => {
    isFocused && handlePaymentStatusZP();
  }, [handlePaymentStatusZP, isFocused]);

  const onPayment = useCallback(async () => {
    console.log('price', price, selectedPayment);
    setIsLoading(true);
    try {
      if (selectedPayment === 'zalopay') {
        const responsePaymentAPI = await requestPaymentZP(price, user?.token);
        console.log('response', responsePaymentAPI);
        if (responsePaymentAPI?.zp_trans_token && responsePaymentAPI?.apptransid) {
          payOrderZalo(responsePaymentAPI?.zp_trans_token);
          // Introduce a small delay to allow ZaloPay SDK to initiate
          setTimeout(() => {
            setPaymentProcessZP(responsePaymentAPI.apptransid);
          }, 2000);
        } else {
          Alert.alert('Lỗi', 'Không thể khởi tạo thanh toán ZaloPay. Vui lòng thử lại.');
          setIsLoading(false);
        }
      } else {
        // For other payment methods, simulate success or handle actual payment logic
        // For now, directly show success for non-ZaloPay methods
        setShowSuccess(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.log('payment err', err);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.');
      setIsLoading(false);
    }
  }, [price, selectedPayment, user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Payment')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.paymentStep2Wrap}>
        <Text style={styles.paymentStep2Title}>{t('choosepaymentmethod')}</Text>
        {PAYMENT_METHODS.map(method => (
          <TouchableOpacity
            key={method.key}
            style={[
              styles.paymentMethodRow,
              selectedPayment === method.key && styles.paymentMethodRowActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setSelectedPayment(method.key)}
          >
            <View style={[
              styles.radioOuter,
              selectedPayment === method.key && styles.radioOuterActive,
            ]}>
              {selectedPayment === method.key && <View style={styles.radioInner} />}
            </View>
            <Image source={method.icon} style={styles.paymentMethodIcon} />
            <Text style={styles.paymentMethodLabel}>{t(`${method.key}`) || method.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBtnRow}>
        <ButtonNavigation
          title={isLoading ? 'Đang xử lý...' : t('payment')}
          backgroundColor="#FF6600"
          onPress={onPayment}
          disabled={isLoading}
        />
      </View>

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successDialog}>
            <Text style={styles.successTitle}>{t('success')}</Text>
            <Text style={styles.successDesc}>{t('successbuydes')}</Text>
            <View style={styles.successImageContainer}>
              <Image
                source={require('../../assert/image/success.png')}
                style={styles.successImage}
              />
            </View>
            <ButtonNavigation
              title={t('viewrecipe')}
              backgroundColor="#FF6600"
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate(nav.home); // Navigate to home or a recipe screen
              }}
              style={styles.dialogButton}
              textStyle={styles.dialogButtonText}
            />
            <ButtonNavigation
              title={t('home')}
              backgroundColor="#E0E0E0"
              color="#222"
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate(nav.home);
              }}
              style={styles.dialogButtonSecondary}
              textStyle={styles.dialogButtonTextSecondary}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const CIRCLE_SIZE = 24;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF6600',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
    paddingTop: 0,
  },
  backBtn: {
    padding: 8,
    marginRight: 4,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 24,
  },
  paymentStep2Wrap: {
    marginHorizontal: 16,
    marginTop: 8,
    flexGrow: 1, // Allow content to grow within ScrollView
  },
  paymentStep2Title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
    marginTop: 8,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  paymentMethodRowActive: {
    borderColor: '#00C48C',
    backgroundColor: '#F0FFF8',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  radioOuterActive: {
    borderColor: '#00C48C',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00C48C',
  },
  paymentMethodIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
    resizeMode: 'contain',
  },
  paymentMethodLabel: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  bottomBtnRow: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successDialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 0,
  },
  successImageContainer: {
    borderRadius: 48,
    width: 118,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 18,
  },
  successImage: {
    width: 119,
    height: 128,
  },
  dialogButton: {
    marginTop: 0,
    borderRadius: 12,
    width: '100%',
  },
  dialogButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dialogButtonSecondary: {
    marginTop: 10,
    borderRadius: 12,
    width: '100%',
  },
  dialogButtonTextSecondary: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaymentScreen;