import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator,Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const CurrentLocationMap = () => {
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 1000, // Chờ tối đa 15 giây
      });
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.006,
        longitudeDelta: 0.006,
      };
      setRegion(newRegion);
  
      mapRef.current?.animateToRegion(newRegion, 1000);
    })();
  }, []);
  

  if (!region) {
    return (
      <View style={styles.mapPlaceholder}>
        <Text>Đang tải bản đồ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        onMapReady={() => setMapLoaded(true)} // Cập nhật trạng thái khi bản đồ sẵn sàng
      >
        {mapLoaded && <Marker coordinate={region} />}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height / 3, // Adjust the size as needed
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    height: Dimensions.get('window').height / 3, // Chỉnh lại giống kích thước của bản đồ
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CurrentLocationMap;
