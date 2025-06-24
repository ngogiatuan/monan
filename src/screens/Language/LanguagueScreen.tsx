import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const LANG_LABELS = {
  vi: {
    vi: 'Tiếng Việt',
    en: 'Tiếng Anh',
    select: 'Chọn ngôn ngữ',
  },
  en: {
    vi: 'Vietnamese',
    en: 'English',
    select: 'Select language',
  },
};

const languages = [
  {
    key: 'vi',
    icon: require('../../assert/image/vietnam.png'),
  },
  {
    key: 'en',
    icon: require('../../assert/image/english.png'),
  },
];

const LanguageScreen = () => {
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.language);

  useEffect(() => {
    setSelected(i18n.language);
  }, [i18n.language]);

  // Lấy label động theo ngôn ngữ hiện tại
  const getLabel = (langKey: string) => {
    const currentLang = i18n.language in LANG_LABELS ? i18n.language : 'vi';
    return LANG_LABELS[currentLang][langKey] || langKey;
  };
  const getSelectLabel = () => {
    const currentLang = i18n.language in LANG_LABELS ? i18n.language : 'vi';
    return LANG_LABELS[currentLang].select || t('language');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('language')}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>{getSelectLabel()}</Text>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.key}
            style={styles.row}
            onPress={() => {
              setSelected(lang.key);
              i18next.changeLanguage(lang.key);
            }}
            activeOpacity={0.7}
          >
            <Image source={lang.icon} style={styles.flag} />
            <Text style={styles.langText}>{getLabel(lang.key)}</Text>
            {selected === lang.key && (
              <Text style={styles.check}>✔</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff6f2c',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  body: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 18,
  },
  label: {
    fontSize: 15,
    color: '#222',
    marginLeft: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  flag: {
    width: 32,
    height: 32,
    marginRight: 16,
    borderRadius: 4,
  },
  langText: {
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  check: {
    color: '#2196f3',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LanguageScreen;

