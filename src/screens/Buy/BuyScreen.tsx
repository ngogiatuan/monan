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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { nav } from '../../navigation/navigationName'; // Ensure nav object is correctly imported

const { width } = Dimensions.get('window');

const PREMIUM_FEATURES = [
  { key: 'exclusiverecipes', free: false },
  { key: 'unlimitedfavorites', free: false },
  { key: 'unlimitedrecipes', free: false },
  { key: 'exclusivevideoguides', free: false },
];

const BuyScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [selectedPackage, setSelectedPackage] = useState('monthly');

  const monthlyPrice = 50000;
  const yearlyPrice = 300000;
  const price = selectedPackage === 'monthly' ? monthlyPrice : yearlyPrice;

  const handleProceedToPayment = () => {
    navigation.navigate(nav.payment, { price, selectedPackage });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <Image
            source={require('../../assert/image/back.png')}
            style={{ width: 44, height: 44, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Premium')}</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Removed Steps UI */}
        <View style={styles.contentContainer}>
          <Text style={styles.premiumTextHeadline}>
            {t('unlockpremiumaccess')}
          </Text>
          <Text style={styles.premiumTextDescription}>
            {t('premiumdescription')}
          </Text>
          <Image
            source={require('../../assert/image/premiumpayment.png')}
            style={styles.premiumImageCentered}
            resizeMode="contain"
          />

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

          <Text style={styles.sectionTitle}>{t('outstandingfeatures')}</Text>
          <View style={styles.featuresListContainer}>
            <View style={styles.featureHeaderRowNoBorder}>
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
              <View key={feature.key} style={styles.featureRowNoBorder}>
                <Text style={styles.featureLabel}>{t(feature.key)}</Text>
                <View style={styles.featureColumn}>
                  {feature.free ? (
                    <Image
                      source={require('../../assert/image/greencheck.png')}
                      style={styles.featureComparisonIcon}
                    />
                  ) : (
                    <Text style={styles.xIconStyle}>X</Text>
                  )}
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
      </ScrollView>
      <View style={styles.bottomBtnRow}>
        <ButtonNavigation
          title={t('payment')}
          backgroundColor="#FF6600"
          onPress={handleProceedToPayment}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF6600',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
    paddingTop: 0,
  },
  headerBackBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 24,
  },
  contentContainer: { 
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
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
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
    borderColor: '#FF6600',
    backgroundColor: '#FFF2E0',
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
  featuresListContainer: {
    width: '100%',
    marginBottom: 20,
  },
  featureRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },
  featureHeaderRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 8,
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
  xIconStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A8A8A',
    lineHeight: 24,
    textAlign: 'center',
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
  radioOuterActivePackage: {
    borderColor: '#FF6600',
  },
  radioInnerActivePackage: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6600',
  },
  bottomBtnRow: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
});

export default BuyScreen;