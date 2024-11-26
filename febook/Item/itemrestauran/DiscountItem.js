import { StyleSheet, Text, View  , Dimensions , ScrollView , TouchableOpacity} from 'react-native'
import React, {useState ,useEffect} from 'react'
import { URL } from '../../const/const';
import moment from 'moment';
const {width , height} = Dimensions.get('window')


const DiscountItem = ({restaurantId}) => {
 
    const [discount , setdiscount ] = useState([]);
    useEffect(()=>{
    console.log("ddataa restaurant" , restaurantId);
        const fetchData = async () => {
          try {
            const response = await fetch(URL+`api/voucher/getVoucherInRestaurant/${restaurantId}`);
            const jsonData = await response.json();
  
           
            setdiscount(jsonData.list)
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchData();

   
    },[])
  return (
      <View>
        {discount.length>0?    <View style = {styles.headerdiscount}>
      <Text style = {styles.nametext}>Mã khuyến mãi được áp dụng cho cửa hàng</Text>
      <ScrollView horizontal   showsHorizontalScrollIndicator={false}>
     {discount.map((data , index)=>
     <View key={index} style={{width:0.65*width , height:0.08*height , backgroundColor:'#F0F0F0' ,  borderWidth:1 ,  alignItems:'center', justifyContent:'center',     marginRight:15,   marginTop:10, borderRadius:10}}>
     <View style = {{flexDirection:'row', margin:10}}>
       <View style={{flexDirection:'column' }}>

         <Text style={{fontWeight:'bold',color:'#616161'}}>Giảm {Math.round(data.money / 1000)}k cho đơn từ { Math.round(data.limit / 1000)}k</Text>
         <Text style={{  fontWeight:'bold' ,color:'#616161'}}>HSD: {moment(data.HSD).format('DD/MM/YYYY')}</Text>
       </View>

    
     </View>
   </View>)}
    </ScrollView>
    </View>:<></>}
      </View>
  )
}

export default DiscountItem

const styles = StyleSheet.create({
    headerdiscount:{
        top:0.01*height,
        marginLeft:15,
    
        
    } , 
    nametext:{
      fontWeight:'bold',
        paddingTop:10
    }
})