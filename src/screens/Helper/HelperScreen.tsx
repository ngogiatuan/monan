import React from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';

// Thay thế dữ liệu mẫu cho hướng dẫn nấu ăn
const steps = [
  {
    id: 1,
    description: 'Chuẩn bị nguyên liệu: thịt, rau, gia vị...',
    image: '', // hoặc có thể để link ảnh nếu muốn
  },
  {
    id: 2,
    description: 'Sơ chế nguyên liệu và bắt đầu nấu.',
    image: '',
  },
];

const HelperScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hướng dẫn nấu ăn</Text>
      <FlatList
        data={steps}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Bước {index + 1}</Text>
            {item.image ? (
              <Image source={{uri: item.image}} style={styles.image} />
            ) : null}
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Chưa có hướng dẫn nào.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 16},
  stepContainer: {marginBottom: 20, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 10},
  stepTitle: {fontSize: 18, fontWeight: '600'},
  image: {width: '100%', height: 180, marginVertical: 8, borderRadius: 8},
  description: {fontSize: 16},
});

export default HelperScreen;
