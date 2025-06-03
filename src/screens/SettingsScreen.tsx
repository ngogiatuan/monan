import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';

const SettingsScreen = () => {
  const [app, setApp] = useState(true);
  const [notify, setNotify] = useState(false);
  const [sms, setSms] = useState(false);
  const [promo, setPromo] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Nền ứng dụng</Text>
        <Switch value={app} onValueChange={setApp} />
      </View>
      <Text style={styles.desc}>Bật tắt chế độ sáng tối</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Thông báo</Text>
        <Switch value={notify} onValueChange={setNotify} />
      </View>
      <Text style={styles.desc}>Cho phép thông báo</Text>
      <View style={styles.row}>
        <Text style={styles.label}>SMS Notifications</Text>
        <Switch value={sms} onValueChange={setSms} />
      </View>
      <Text style={styles.desc}>For daily update you will get it</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Promotion Notifications</Text>
        <Switch value={promo} onValueChange={setPromo} />
      </View>
      <Text style={styles.desc}>For daily update you will get it</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
  label: { fontSize: 16, fontWeight: 'bold' },
  desc: { color: '#888', marginLeft: 2, marginBottom: 8 },
});

export default SettingsScreen;
