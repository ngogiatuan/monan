import React from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

const HelperScreen = () => {
  const steps = useSelector((state: RootState) => state.helper.steps);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hướng dẫn nấu ăn</Text>
      <FlatList
        data={steps}
        keyExtractor={item => item.id.toString()}
        renderItem={({item, index}) => (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Bước {index + 1}</Text>
            {item.image && (
              <Image source={{uri: item.image}} style={styles.image} />
            )}
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
