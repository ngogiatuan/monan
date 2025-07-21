// components/DetailProfileInfo.tsx
import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { isPre } from '../api/userApi';

const DetailProfileInfo = () => {
  const { user } = useContext(UserContext); // <-- user context sẽ tự động cập nhật khi EditProfileScreen thay đổi
  const { t } = useTranslation();

  const labels = {
    member_normal: t('member_normal'),
    member_premium: t('member_premium'),
  };

  let isPremium = false;
  let premiumDate = '';
  if (user) {
    isPremium = isPre(user);
    if (isPremium) {
      try {
        const d = new Date(user.premium);
        premiumDate = `HSD: ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      } catch {
        premiumDate = '';
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.coverWrap}>
        <Image
          source={
            typeof user?.cover === 'string'
              ? { uri: user.cover }
              : require('../assert/image/cover.png')
          }
          style={styles.coverImg}
          resizeMode="cover"
        />
        <View style={styles.avatarWrap}>
          <Image
            source={
              typeof user?.avatar === 'string'
                ? { uri: user.avatar }
                : require('../assert/image/avatar.png')
            }
            style={styles.avatar}
          />
        </View>
      </View>
      <View style={styles.infoContentWrap}>
        <View style={styles.whiteDetailsBlock}>
          <View style={styles.innerContentWrapper}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.memberText}>{user?.email}</Text>
            <Text style={styles.memberTextAfterSeparator}>
              {isPremium ? labels.member_premium : labels.member_normal}
            </Text>
            {isPremium && (
              <Text style={styles.memberText}>
                {premiumDate}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginBottom: 0,
  },
  coverWrap: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  coverImg: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  avatarWrap: {
    position: 'absolute',
    left: 32,
    bottom: -21,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eee',
  },
  infoContentWrap: {
    backgroundColor: '#f5f5f5',
    marginTop: -8,
    paddingTop: 49,
    paddingHorizontal: 0,
    paddingBottom: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  whiteDetailsBlock: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 12,
    position: 'relative',
  },
  innerContentWrapper: {
    marginLeft: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    marginBottom: 2,
  },
  memberText: {
    color: '#888',
    fontSize: 14,
  },
  memberTextAfterSeparator: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
  },
});

export default DetailProfileInfo;