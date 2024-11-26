import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { URL } from '../const/const'
import ToolBar from '../components/ToolBar'
const { width, height } = Dimensions.get('window')
const SearchComponent = ({ navigation }) => {
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState([]);
  const handleButtonPress = () => {
    axios.post(URL + 'api/product/getbyname', {
      name: inputText
    }).then(response => {
      if(response.data.msg==='Không tìm thấy sản phẩm nào.'){
        setData([])
      }else{
        setData(response.data); 
        console.log(response.data, "DATA");
      
      }

     
    })
  };




  const numColumns = 3; // Số cột trên mỗi hàng
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth / numColumns;

  const renderItem = ({ item }) => {
    return (
      <View style={{ margin: 15, flexDirection: 'row', height: 90, alignItems: 'center' }} >

        <View >
          <Image source={require('./../Image/imagedoan.png')} />
        </View>
        <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#616161' }}>{item.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Image source={{uri: item.image}} style={{ width: 20, height: 20, marginTop: 5 }} />
            <Text style={{ padding: 5, fontWeight: 'bold', color: '#616161' }}>{item}</Text>
          </View>
          <Text style={{ color: '#616161' }}>{item}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView >
      <ToolBar title="Tìm kiếm" onBackPress={() => navigation.goBack()} />

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => { navigation.navigate('Search') }}>
          <TextInput
            style={{
              width: 0.8 * width,
              height: 40,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: 'black',
              marginLeft: 15,
              marginTop: 15,
              paddingLeft: 10,
            }}
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            placeholder="Nhập từ khóa tìm kiếm"
          />
        </TouchableOpacity >
        <View
          style={{
            width: 40,
            borderRadius: 15,
            marginLeft: 5,
            height: 40,
            backgroundColor: '#319AB4',
            justifyContent: 'center',
            marginTop: 15,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={handleButtonPress} >
            <Image
              source={require('./../Image/search.png')}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <FlatList
          data={data}
          horizontal={false} // Hiển thị theo chiều ngang và dọc
          renderItem={(item, index)=>{
            console.log(item.name)
            const product = item.item
            return(
              <TouchableOpacity key={index} style={{ margin: 15, flexDirection: 'row', height: 90, alignItems: 'center', marginTop: 20 }} onPress={() => { navigation.navigate('ProductDetail', { product })}} >

                

                <View >
                <Image source={{ uri: item.item.image }} style={{ borderWidth: 1, width: width * 0.25, height: width * 0.25 , borderRadius:10 }} />
              </View>
              <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#616161' }}numberOfLines={2}>{item.item.name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  
                  <Text style={{ paddingTop:5 , paddingBottom:5, fontWeight: 'bold', color: '#616161' }}>{item.item.realPrice} {'VND'}</Text>
                </View>
                <Text style={{ color: '#616161', width: 0.6 * width }} numberOfLines={4}>{item.item.description}</Text>
              </View>
                
              </TouchableOpacity>
            )
          }}
          // keyExtractor={(item) => item.id}
          numColumns={numColumns}
        />
      
      </View>

      <View>
      </View>
    </SafeAreaView>
  )
}

export default SearchComponent

const styles = StyleSheet.create({})