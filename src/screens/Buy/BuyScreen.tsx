import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { nav } from '../../navigation/navigationName';

const { width } = Dimensions.get('window');

const STEPS = [
  { label: 'Bạn chọn' },
  { label: 'Thông tin' },
  { label: 'Thanh toán' },
];

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

const BuyScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const item = route.params?.item;
  console.log('[BuyScreen] item:', item);

  const { t } = useTranslation();

  const [step, setStep] = useState(1);  
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [showSuccess, setShowSuccess] = useState(false);

  // Tính tổng tiền (giả lập, có thể thêm logic giảm giá nếu cần)
  const price = item?.price || 0; // Giả sử giá mặc định là 100000đ
  const discount = 0;
  const total = price - discount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          {/* Đổi icon thành ký tự '<' thay vì back.png */}
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('buyrecipe') }</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Steps */}
        <View style={styles.stepsRow}>
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.label}>
              <TouchableOpacity
                style={styles.stepCircleWrap}
                activeOpacity={0.8}
                onPress={() => setStep(idx + 1)}
              >
                <View
                  style={[
                    styles.stepCircle,
                    step === idx + 1 && { backgroundColor: '#00C48C', borderColor: '#00C48C' },
                  ]}
                >
                  <View
                    style={[
                      styles.stepInner,
                      step === idx + 1 && { backgroundColor: '#fff' },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step === idx + 1 && { color: '#00C48C', fontWeight: 'bold' },
                  ]}
                >
                  {t(`buy_step_${idx + 1}`) || s.label}
                </Text>
              </TouchableOpacity>
              {idx < STEPS.length - 1 && (
                <View style={styles.stepLine} />
              )}
            </React.Fragment>
          ))}
        </View>
        {/* Bước 1: Thông tin đơn hàng */}
        {step === 1 && (
          <>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{uri: item?.imageUrls[0] }}
                  style={styles.foodImg}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.infoLabel}>{t('buyselectedrecipe') }</Text>
                  <Text style={styles.infoTitle} numberOfLines={2}>
                    {item?.name || ''}
                  </Text>
                </View>
              </View>
            </View>
            {/* Promo code */}
            <View style={styles.promoRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image source={require('../../assert/image/ticket.png')} style={styles.promoIcon} />
                <Text style={styles.promoLabel}>{t('enterpromocode') }</Text>
              </View>
              <Switch
                value={promoEnabled}
                onValueChange={setPromoEnabled}
                trackColor={{ false: '#ccc', true: '#00C48C' }}
                thumbColor={promoEnabled ? '#00C48C' : '#f4f3f4'}
              />
            </View>
            {promoEnabled && (
              <TextInput
                style={styles.promoInput}
                placeholder={t('enterpromocodeplaceholder') }
                value={promoCode}
                onChangeText={setPromoCode}
                placeholderTextColor="#888"
              />
            )}
            {/* Payment Info */}
            <View style={styles.paymentCard}>
              <Text style={styles.paymentTitle}>{t('payment')}</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>{t('unitprice')}</Text>
                <Text style={styles.paymentValue}>{price.toLocaleString('vi-VN')}đ</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>{t('discount')}</Text>
                <Text style={styles.paymentValue}>{discount.toLocaleString('vi-VN')}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabelBold}>{t('total')}</Text>
                <Text style={styles.paymentValueBold}>{total.toLocaleString('vi-VN')}đ</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.policyText}>
                  {t('refundpolicy') }{' '}
                  <Image source={require('../../assert/image/link.png')} style={styles.linkIcon} />
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* Bước 2: Chọn phương thức thanh toán */}
        {step === 2 && (
          <View style={styles.paymentStep2Wrap}>
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
                <Text style={styles.paymentMethodLabel}>{t(`payment_method_${method.key}`) || method.label}</Text>
              </TouchableOpacity>
            ))}
            {/* Payment Info */}
            <View style={styles.paymentCard}>
              <Text style={styles.paymentTitle}>{t('payment')}</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>{t('unit_price')}</Text>
                <Text style={styles.paymentValue}>{price.toLocaleString('vi-VN')}đ</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>{t('discount')}</Text>
                <Text style={styles.paymentValue}>{discount.toLocaleString('vi-VN')}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabelBold}>{t('total') }</Text>
                <Text style={styles.paymentValueBold}>{total.toLocaleString('vi-VN')}đ</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.policyText}>
                  {t('refundpolicy')}{' '}
                  <Image source={require('../../assert/image/link.png')} style={styles.linkIcon} />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      {/* Button */}
      <View style={styles.bottomBtnRow}>
        {step === 1 ? (
          <ButtonNavigation
            title={`${t('continue')} - ${total.toLocaleString('vi-VN')}đ`}
            backgroundColor="#FF6600"
            onPress={() => setStep(2)}
          />
        ) : step === 2 ? (
          <ButtonNavigation
            title={t('pay')}
            backgroundColor="#FF6600"
            onPress={() => setShowSuccess(true)}
          />
        ) : null}
      </View>
      {/* Dialog thành công */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.successOverlay}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, width: '90%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8, textAlign: 'center' }}>{t('success') }</Text>
            <Text style={{ fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 0 }}>{t('successbuydesc')}</Text>
            <View style={{ backgroundColor: '#00C48C', borderRadius: 48, width: 72, height: 72, alignItems: 'center', justifyContent: 'center', marginTop: 18, marginBottom: 18 }}>
              <Image
                source={require('../../assert/image/check.png')}
                style={{ width: 44, height: 44 }}
              />
            </View>
            <ButtonNavigation
              title={t('viewrecipe')}
              backgroundColor="#FF6600"
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate(nav.detail, { recipeId: item?._id });
              }}
              style={{ marginTop: 0, borderRadius: 12, width: '100%' }}
              textStyle={{ fontWeight: 'bold', fontSize: 16 }}
            />
            <ButtonNavigation
              title={t('home')}
              backgroundColor="#E0E0E0"
              color="#222"
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate(nav.home);
              }}
              style={{ marginTop: 10, borderRadius: 12, width: '100%' }}
              textStyle={{ color: '#222', fontWeight: 'bold', fontSize: 16 }}
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
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 24,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 18,
    marginHorizontal: 8,
  },
  stepCircleWrap: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  stepLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 0,
    textAlign: 'center',
  },
  stepLine: {
    width: 28,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: -2,
    marginTop: CIRCLE_SIZE / 2 - 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6F8F3',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  foodImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  infoLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoTitle: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 0,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
  },
  promoIcon: {
    width: 22,
    height: 22,
    tintColor: '#00C48C',
    marginRight: 8,
  },
  promoLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  promoInput: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#222',
    backgroundColor: '#FAFAFA',
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6F8F3',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  paymentLabel: {
    color: '#888',
    fontSize: 14,
  },
  paymentLabelBold: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  paymentValue: {
    color: '#222',
    fontSize: 14,
  },
  paymentValueBold: {
    color: '#FF6600',
    fontWeight: 'bold',
    fontSize: 16,
  },
  policyText: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'left',
    textDecorationLine: 'underline',
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIcon: {
    width: 14,
    height: 14,
    tintColor: '#888',
    marginLeft: 2,
    marginTop: 1,
  },
  bottomBtnRow: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  // Thêm style cho radio và payment method
  paymentStep2Wrap: {
    marginHorizontal: 16,
    marginTop: 8,
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
    paddingHorizontal: 8, // giảm padding ngang
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
    fontSize: 14, // giảm font size
    color: '#222',
    fontWeight: '500',
    flexShrink: 1, // cho text co lại nếu dài
    flexWrap: 'wrap',
  },
  // Success modal styles
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  successIconWrap: {
    backgroundColor: '#F0FFF8',
    borderRadius: 40,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successIcon: {
    width: 40,
    height: 40,
    tintColor: '#00C48C',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default BuyScreen;
