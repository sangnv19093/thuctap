import { SafeAreaView, StyleSheet, Text,   TouchableOpacity , View , Image  , FlatList, ScrollView , Dimensions} from 'react-native'
import React , {useEffect , useState} from 'react'
import { URL } from '../const/const'
import ToolBar from '../components/ToolBar';
const { width, height } = Dimensions.get('window');

const GanbanComponent = ({navigation}) => {
  const[ganban , setganban] = useState([])

  useEffect(()=>{
    const fetchData = async () => {
      try {

        const response = await fetch(`${URL}api/productDanhmuc/san5`);
        const jsonData = await response.json();
        setganban(jsonData.products);
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
    <SafeAreaView style ={{marginTop:0 ,  flex:1}}> 
     <ToolBar title="Sân5" onBackPress={() => navigation.goBack()} />

    <ScrollView >

        {ganban.map((data, index) =>
  
          <View key={index} style={{ backgroundColor: '#f0f0f0', marginTop: 6, marginRight: 5, borderRadius: 10 }}>
            <TouchableOpacity
              style={{ margin: 15, flexDirection: 'row', height: 90, alignItems: 'center' }}
              onPress={() => navigation.navigate('ProductDetail', { product: data , type :'type'})}
            >
              <View >
                <Image source={{ uri: data.image }} style={{ borderWidth: 1, width: width * 0.25, height: width * 0.25 , borderRadius:10 }} />
              </View>
              <View style={{ flexDirection: 'column', paddingLeft: 10, marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#616161' }}numberOfLines={2}>{data.name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  
                  <Text style={{ paddingTop:5 , paddingBottom:5, fontWeight: 'bold', color: '#616161' }}>Giá: {data.realPrice}</Text>
                </View>
                <Text style={{ color: '#616161', width: 0.6 * width }} numberOfLines={4}>Mô tả:{data.description}</Text>
              </View>
            </TouchableOpacity>
          </View>
     
        )}
     </ScrollView>

    </SafeAreaView>
  )
}

export default GanbanComponent

const styles = StyleSheet.create({})