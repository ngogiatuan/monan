import React, { useState } from 'react';
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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { nav } from '../../navigation/navigationName';

const { width } = Dimensions.get('window');

const STEPS = [
  { label: 'Bạn chọn' },
  { label: 'Phương thức' }, // Changed label for clarity
  { label: 'Thanh toán' }, // New step for payment summary
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

const PREMIUM_FEATURES = [
  { key: 'exclusiverecipes', free: false },
  { key: 'unlimitedfavorites', free: false },
  { key: 'unlimitedrecipes', free: false },
  { key: 'exclusivevideoguides', free: false },
  // Thêm các tính năng khác nếu có, với trường `free` = true/false
];

const BuyScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const item = route.params?.item;
  console.log('[BuyScreen] item:', item);

  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [selectedPackage, setSelectedPackage] = useState('monthly'); // 'monthly' hoặc 'yearly'
  const [showSuccess, setShowSuccess] = useState(false);

  // Tính tổng tiền
  const monthlyPrice = 50000;
  const yearlyPrice = 300000;
  const price = selectedPackage === 'monthly' ? monthlyPrice : yearlyPrice;
  const discount = 0; // Không có promo code ở đây nữa
  // const total = price - discount; // Total không còn được hiển thị trên màn hình riêng

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Premium')}</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Steps */}
        <View style={styles.stepsRow}>
          {STEPS.map((s, idx) => (
            <React.Fragment key={s.label}>
              <TouchableOpacity
                style={styles.stepCircleWrap}
                activeOpacity={0.8}
                onPress={() => {
                  // Allow navigation back to previous steps, but not past the current step
                  if (idx + 1 <= step) {
                    setStep(idx + 1);
                  }
                }}
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
                  {t('step_title') + ` ${idx + 1}`}
                </Text>
              </TouchableOpacity>
              {idx < STEPS.length - 1 && (
                <View style={styles.stepLine} />
              )}
            </React.Fragment>
          ))}
        </View>
        {/* Bước 1: Thông tin gói Premium */}
        {step === 1 && (
          <View style={styles.step1Container}>
            {/* Văn bản "Mở khóa quyền truy cập Premium..." */}
            <Text style={styles.premiumTextHeadline}>
              {t('unlockpremiumaccess')}
            </Text>
            <Text style={styles.premiumTextDescription}>
              {t('premiumdescription')}
            </Text>
            {/* Hình ảnh */}
            <Image
              source={require('../../assert/image/premiumpayment.png')}
              style={styles.premiumImageCentered}
              resizeMode="contain"
            />

            {/* Chọn gói của bạn */}
            <Text style={styles.sectionTitle}>{t('chooseyourpackage')}</Text>
            <View style={styles.packageOptionsContainer}>
              <TouchableOpacity
                style={[
                  styles.packageOption,
                  selectedPackage === 'monthly' && styles.packageOptionActive,
                ]}
                onPress={() => setSelectedPackage('monthly')}
              >
                <View style={[
                  styles.radioOuter,
                  selectedPackage === 'monthly' && styles.radioOuterActivePackage,
                ]}>
                  {selectedPackage === 'monthly' && <View style={styles.radioInnerActivePackage} />}
                </View>
                <View>
                  <Text style={styles.packageLabel}>{t('monthly')}</Text>
                  <Text style={styles.packagePrice}>50.000đ/ {t('month')}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.packageOption,
                  selectedPackage === 'yearly' && styles.packageOptionActive,
                ]}
                onPress={() => setSelectedPackage('yearly')}
              >
                <View style={[
                  styles.radioOuter,
                  selectedPackage === 'yearly' && styles.radioOuterActivePackage,
                ]}>
                  {selectedPackage === 'yearly' && <View style={styles.radioInnerActivePackage} />}
                </View>
                <View>
                  <Text style={styles.packageLabel}>{t('yearly')}</Text>
                  <Text style={styles.packagePrice}>300.000đ/ {t('year')}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Các tính năng nổi bật */}
            <Text style={styles.sectionTitle}>{t('outstandingfeatures')}</Text>
            <View style={styles.featuresContainer}>
              <View style={[styles.featureRow, styles.featureHeaderRow]}>
                <Text style={styles.featureLabel}></Text>
                <Text style={styles.featureColumnHeader}>{t('free')}</Text>
                <View style={styles.featureColumnHeaderImageContainer}>
                  <Image
                    source={require('../../assert/image/premium.png')}
                    style={styles.premiumHeaderIcon}
                    resizeMode="contain"
                  />
                </View>
              </View>
              {PREMIUM_FEATURES.map((feature) => (
                <View key={feature.key} style={styles.featureRow}>
                  <Text style={styles.featureLabel}>{t(feature.key)}</Text>
                  <View style={styles.featureColumn}>
                    <Image
                      source={feature.free ? require('../../assert/image/greencheck.png') : require('../../assert/image/cancel.png')}
                      style={styles.featureComparisonIcon}
                    />
                  </View>
                  <View style={styles.featureColumn}>
                    <Image
                      source={require('../../assert/image/greencheck.png')}
                      style={styles.featureComparisonIcon}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
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
                <Text style={styles.paymentMethodLabel}>{t(`${method.key}`) || method.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* Bước 3 không còn là màn hình tóm tắt riêng, nó sẽ dẫn đến dialog thành công */}
        {/* Phần hiển thị chi tiết thanh toán trước đây đã bị loại bỏ */}

      </ScrollView>
      {/* Button */}
      <View style={styles.bottomBtnRow}>
        {step === 1 && (
          <ButtonNavigation
            title={t('payment')}
            backgroundColor="#FF6600"
            onPress={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <ButtonNavigation
            title={t('payment')}
            backgroundColor="#FF6600"
            onPress={() => {
              // Logic xử lý thanh toán thực tế sẽ ở đây
              setStep(3); // Kích hoạt Bước 3 trên thanh tiến trình
              setShowSuccess(true); // Hiển thị dialog thành công
            }}
          />
        )}
        {/* Nút ở Bước 3 đã bị loại bỏ vì không còn màn hình riêng cho Bước 3 */}
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 8, textAlign: 'center' }}>{t('success')}</Text>
            <Text style={{ fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 0 }}>{t('successbuydes')}</Text>
            {/* Đã xóa background xanh lá cây ở đây, chỉ giữ lại background màu trắng mặc định hoặc không set */}
            <View style={{ borderRadius: 48, width: 90, height: 90, alignItems: 'center', justifyContent: 'center', marginTop: 18, marginBottom: 18 }}> {/* Tăng kích thước bao quanh icon */}
              <Image
                source={require('../../assert/image/success.png')}
                // Tăng kích thước ảnh
                style={{ width: 150, height: 80 }} // Tăng từ 60x60 lên 80x80
              />
            </View>
            <ButtonNavigation
              title={t('viewrecipe')}
              backgroundColor="#FF6600"
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate(nav.home); // Điều hướng về trang công thức hoặc trang chính
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
                navigation.navigate(nav.home); // Điều hướng về trang chủ
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
  step1Container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  premiumTextHeadline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
    lineHeight: 28,
  },
  premiumTextDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  premiumImageCentered: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 15,
  },
  packageOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  packageOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
  },
  packageOptionActive: {
    borderColor: '#FF6600', // Changed to orange
    backgroundColor: '#FFF2E0', // Light orange background
  },
  packageLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
  },
  packagePrice: {
    fontSize: 13,
    color: '#888',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingHorizontal: 10,
  },
  featureHeaderRow: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  featureLabel: {
    fontSize: 15,
    color: '#222',
    flex: 2,
    fontWeight: '500',
  },
  featureColumnHeader: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  featureColumnHeaderImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumHeaderIcon: {
    width: 60,
    height: 20,
  },
  featureColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureComparisonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
    marginBottom: 8,
    marginTop: 0,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2',
    width: '100%',
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
    width: '100%',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#222',
    backgroundColor: '#FAFAFA',
  },
  paymentCard: { // This style block is no longer directly used for step 3 content, but could be useful if other summary is added.
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 0,
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
  radioOuterActivePackage: {
    borderColor: '#FF6600',
  },
  radioInnerActivePackage: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6600',
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
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Đã xóa style 'successModal' vì không còn dùng.
  // Đã xóa 'successIconWrap' vì không còn dùng hoặc đã chỉnh sửa inline
  successIcon: { // Đây là style cũ, đã bị ghi đè bởi inline style
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