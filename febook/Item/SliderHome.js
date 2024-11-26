import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Dimensions,Text } from 'react-native';
import Swiper from 'react-native-swiper';

const { width,height } = Dimensions.get('window');
import { URL } from '../const/const';

const SliderHome = ({}) => {
  const [index, setIndex] = useState(0);
  const [imageslider, setimageslider] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL + 'api/slider/getAll');
        const jsonData = await response.json();
        setimageslider(jsonData.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
}, []);

    useEffect(() => {
        const interval = setInterval(() => {
          if (imageslider.length > 0) {
            setIndex(prevIndex => (prevIndex + 1) % imageslider.length);
          }
        }, 3000);
        
        return () => clearInterval(interval);
      }, [imageslider]);

  return (
    <Swiper
      style={{ height: 0.25 * height,margin: 15 }}
      showsButtons={false}
      autoplay={false}
      loop={false}
      index={index}
      onIndexChanged={(i) => setIndex(i)}
    >
      {imageslider.map((item, i) => (
        <View key={i} style={{ flex: 1 }}>
          <Image
            source={{ uri: item.image}}
            style={{width: 0.925 * width,
                    height: 0.25 * height,
                    borderRadius: 15, }}
            resizeMode='cover'
          />
        </View>
    
      ))}
    </Swiper>
  );
};

export default SliderHome;