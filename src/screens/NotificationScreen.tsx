import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const notifications = [
  { id: 1, title: 'Món ăn của bạn đã được phê duyệt', time: '2 giờ trước' },
  { id: 2, title: 'Món ăn của bạn được yêu thích giá', time: '5 giờ trước' },
  { id: 3, title: 'Món ăn của bạn được phê duyệt', time: '1 ngày trước' },
  { id: 4, title: 'Món ăn của bạn được yêu thích giá', time: '2 ngày trước' },
];

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông báo</Text>
      <ScrollView>
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 12 },
  icon: { width: 32, height: 32, backgroundColor: '#ff9800', borderRadius: 16, marginRight: 12 },
  title: { fontSize: 16, fontWeight: 'bold' },
  time: { color: '#888', fontSize: 12 },
});

export default NotificationScreen;
