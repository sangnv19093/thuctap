import { StyleSheet, Text, View  , ScrollView , Dimensions , TouchableOpacity , Image} from 'react-native'
import React, { useEffect, useState } from 'react'

const { width, height } = Dimensions.get('window');

import { useNavigation } from '@react-navigation/native';
import { URL } from '../const/const';
import ToolBar from '../components/ToolBar';

const AllRestaurnat = ({route}) => {
 const navigation = useNavigation();



    const [restaurant , setdatarestaurnat] = useState([]) 

    useEffect(()=>{
       
            const fetchData = async () => {
              try {
        
                  const response = await fetch(URL+'api/restaurant/getAll');
                const jsonData = await response.json();
                const filteredData = jsonData.data.filter(item => item.role === "user");
                setdatarestaurnat(filteredData);
              } catch (error) {
                console.error(error);
              }
            };
        
            fetchData();
        }
        
     , [])
     
  return (
    <View style={{ flex:1 , backgroundColor:'white'}}>

      <ToolBar title="Tất cả Sân bóng" onBackPress={() => navigation.goBack()} />
      
        <ScrollView  showsVerticalScrollIndicator={false}>
        {restaurant.map((data, index) =>
       
          <View style={{ margin:15  }} key={index}>
          <TouchableOpacity onPress={() => navigation.navigate('Restaurant', { restaurant: data._id  })}>
            <View style={{ }}>
              <Image source={{ uri: data.image }} style={{ width: 0.92 * width , height: 0.2 * height, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
            </View>
            <View style={{ borderBottomLeftRadius:10  , borderBottomRightRadius:10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ADD8E6', width: 0.92 * width, height: 0.08 * height }}>
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#616161', marginTop: 20  , paddingLeft:10}}>{data.name}</Text>

                <Text style={{ fontWeight: 'bold', color: '#616161'  , paddingLeft:10}}>{data.timeon} AM-{data.timeoff} PM</Text>
                <Text style={{ fontWeight: 'bold', color: '#616161' }}>{data.adress}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Restaurant', { restaurant: data._id})} style={{ marginLeft: 'auto', backgroundColor: '#FFFFFF', width: 0.05 * width, alignItems: 'center', justifyContent: 'center', height: 0.025 * height, borderRadius: 20, marginTop: 20, marginRight: 10 }} >
                <Image source={require('./../Image/right_arrow.png')} style={{ width: 15, height: 15 }} />
              </TouchableOpacity>
            </View>
            </TouchableOpacity>
          </View>)}
      </ScrollView>
    </View>
  );
}

export default AllRestaurnat

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
      },
      backText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      titleText: {
        fontSize: 25,
        marginLeft: 10, 
         fontWeight:'bold'

      },
      separator: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginVertical: 5,
      },
})