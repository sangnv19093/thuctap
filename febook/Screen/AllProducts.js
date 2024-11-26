import { StyleSheet, Text, View  , ScrollView , Image , TouchableOpacity , Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'
import ToolBar from '../components/ToolBar';
import { URL } from '../const/const';
const { width, height } = Dimensions.get('window');
const AllProducts = ({navigation}) => {
    const [dataproducts , setdataproducts] = useState([])
    useEffect(()=>{
        const fetchData = async () => {
            try {
      
              const response = await fetch(URL+'api/product/suggest');
      
      
              const jsonData = await response.json();
          
        
      
              setdataproducts(jsonData.data);
            } catch (error) {
              console.error(error);
            }
          };
      
          fetchData();
    },[])
    const truncateString = (str, num) => {
      if (str.length > num) {
        return str.slice(0, num) + '...';
      } else {
        return str;
      }
    };
  return (
    <View style = {{backgroundColor: 'white', paddingTop:30}}>
         <ToolBar
        title="Tất cả sản phẩm"
        onBackPress={() => navigation.goBack()}
      />
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {dataproducts.map((data, index) =>
          <View key={index} style={{ backgroundColor: '#f0f0f0', margin:5, borderRadius: 10 }}>
            <TouchableOpacity
              style={{ margin: 15, flexDirection: 'row', height: 90, alignItems: 'center' }}
              onPress={() => navigation.navigate('ProductDetail', { product: data })}
            >
              <View >
                <Image source={{ uri: data.image }} style={{ borderWidth: 1, width: width * 0.25, height: width * 0.25 , borderRadius:10 }} />
              </View>
              <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#616161' }}>{truncateString(data.name, 13)}
                </Text>
                <View style={{ flexDirection: 'row'  }}>
              
                  <Text style={{ paddingBottom:5 , paddingTop:5, fontWeight: 'bold', color: '#616161' }}>{truncateString(data.restaurantId.name, 18)}</Text>
                </View>
                <Text style={{ color: '#616161', width: 0.6 * width, fontWeight: 'bold' , paddingRight:15 }} numberOfLines={2}>Mô tả: {data.description}</Text>
              </View>
            </TouchableOpacity>
          </View>



        )}
      </ScrollView>
    </View>
  )
}

export default AllProducts

const styles = StyleSheet.create({})