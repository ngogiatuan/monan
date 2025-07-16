import React from 'react';
import { View, Text, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native'; // Import Image
import { useTranslation } from 'react-i18next';

interface AuthFormProps {
  title?: string;
  desc?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  backgroundImage?: any;
  bottomSheetStyle?: any;
}

const AuthForm = ({
  title,
  desc,
  children,
  onBack,
  showBack = false,
  backgroundImage = require('../assert/image/authen.png'),
  bottomSheetStyle,
}: AuthFormProps) => {
  const { t } = useTranslation();
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'flex-end' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.bottomSheet, bottomSheetStyle]}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Image
                source={require('../assert/image/back.png')} 
                style={styles.backIcon}
              />
              <Text style={styles.backText}>{t('back')}</Text>
            </TouchableOpacity>
          )}
          {title ? <Text style={styles.title}>{t(title) || title}</Text> : null}
          {desc ? <Text style={styles.desc}>{t(desc) || desc}</Text> : null}
          {children}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backIcon: {
    width: 24, // Adjust size as needed
    height: 24, // Adjust size as needed
    tintColor: '#888', // Adjust color as needed
    marginRight: 4,
  },
  backText: {
    color: '#888',
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    color: '#222',
  },
  desc: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
  },
});

export default AuthForm;