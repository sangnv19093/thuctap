import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, TextInput, FlatList, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
const { width, height } = Dimensions.get('window')
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ToolBar from './../components/ToolBar';
import { URL } from '../const/const';

const ProductsFavorite = ({navigation}) => {
    const [datafavorite , setdataFavorite] = useState([])


    const checkLogin =  async()=>{
      const isLogin = await AsyncStorage.getItem('isLogin');
      if(isLogin==='false'){
            setdataFavorite([])
        return;
    }

    }
  const getdataFavorite = async()=>{
    const storedUserId = await AsyncStorage.getItem('_id')
    const isLogin = await AsyncStorage.getItem('isLogin');
    if(isLogin==='false'){
          setdataFavorite([])
      return;}
      
    fetch(`${URL}api/favorite/getbyUid/${storedUserId}`)
    .then(response => response.json())
    .then(data => {
      // Xử lý dữ liệu ở đây
      if(data){
        console.log("data products fav" ,data[0].listFavorite);
        const datafavorite = data[0].listFavorite;
        setdataFavorite(datafavorite)
      }
      else{
        setdataFavorite([])
      }


     
    })
    .catch(error => {
      // Xử lý lỗi ở đây
      setdataFavorite([])
    });
  }
  useEffect(()=>{
      checkLogin();
      getdataFavorite()
  } , [])
  useFocusEffect(
    React.useCallback(() => {
      getdataFavorite();
    }, [])
  );
  const renderItem = ({ item }) => (
    <View>
     <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd'}}>
            <TouchableOpacity
              style={{ margin: 15, flexDirection: 'row', height: 90, alignItems: 'center' }}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
            >
              <View >
                <Image source={{ uri: item.image }} style={{ borderWidth: 1, width: width * 0.25, height: width * 0.25}} />
              </View>
              <View style={{  flexDirection: 'column', paddingLeft: 10, marginLeft: 10  }}>
                <Text style={{fontWeight: 'bold', fontSize: 15, color: '#616161' }} numberOfLines={2}>Tên Sân: 
                  {item.name}
                </Text>
                <View style={{ flexDirection: 'row'  }}>
            
                  <Text style={{paddingBottom: 5, paddingTop: 5, fontWeight: 'bold', color: '#616161' }}>{item.restaurantId.name}</Text>
                </View>
                <Text style={{ color: '#616161', width: 0.6 * width, fontWeight: 'bold', paddingRight: 15 }} numberOfLines={4}>Mô tả: {item.description}</Text>
              </View>
            </TouchableOpacity>

           
          </View>
    </View>
  );
  return (
    <SafeAreaView style={{flex: 1 , backgroundColor:'white' }}>
     <ToolBar title="Sân bóng yêu thích" onBackPress={() => navigation.goBack()} />
      <FlatList data={datafavorite}
      keyExtractor={(item) =>item._id.toString()}
      renderItem={renderItem}/>
     
    </SafeAreaView>
  )
}

export default ProductsFavorite

const styles = StyleSheet.create({
    
})