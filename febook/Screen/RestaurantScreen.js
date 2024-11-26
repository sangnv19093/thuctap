import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import HeaderRestaurant from "../Item/itemrestauran/HeaderRestaurant";
import CoffeeShopScreen from "../Item/itemrestauran/HeaderRestaurant";
import DiscountItem from "../Item/itemrestauran/DiscountItem";
import MenuRestaurant from "../Item/itemrestauran/MenuRestaurant";
import Icon from 'react-native-vector-icons/FontAwesome';
import Stars from 'react-native-stars'; // Import from FontAwesome

import KhuyenmaiRestaurant from "../Item/itemrestauran/KhuyenmaiRestaurant";
import { URL } from "../const/const";
const { width, height } = Dimensions.get("window");
const RestaurantScreen = ({ navigation , route  }) => {

  const [datarestaurnat , setdatarestaurant] = useState([])
  const {restaurant} = route.params;



  useEffect(()=>{

    
    const fetchData = async()=>{
      const response = await fetch(`${URL}api/restaurant/${restaurant}`)

      const jsondata = await response.json();
  
        setdatarestaurant(jsondata.data[0])
    }
    fetchData()
    console.log("restaurnat id" , restaurant);
    console.log("restaurnat id33" , datarestaurnat);
  } , [])


useEffect(()=>{

},[])
  return (
    <View style={styles.container}>
      {/* <HeaderRestaurant/> */}
      <ScrollView>

  
        <CoffeeShopScreen  navigation = {navigation} data = {datarestaurnat}/>
        <View style={{marginTop:height*0.04}}>
        <Stars
                        default={datarestaurnat.average}
                        count={5}
                        starSize={300}
                        disabled={true}
                        half={true}
                        update={(val)=>{ setStarRating(val) }}
                        fullStar={<Icon name={'star'} size={24} style={[styles.myStarStyle, { color: 'yellow' }]}/>}
                        emptyStar={<Icon name={'star-o'} size={24} style={[styles.myStarStyle, { color: 'blue' }]}/>}
                        halfStar={<Icon name={'star-half'} size={24} style={[styles.myStarStyle, { color: 'yellow' }]}/>} 
                      />
        </View>
        
        <DiscountItem  navigation = {navigation}restaurantId = {restaurant} />
        {/* <KhuyenmaiRestaurant  navigation = {navigation} /> */}
        <MenuRestaurant  navigation = {navigation} data = {restaurant} />
      </ScrollView>
    </View>
  );
};

export default RestaurantScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: width * 0.12,
  },
  myStarStyle: {
    backgroundColor: 'transparent',
    textShadowColor: 'blue',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    // Do not set color here if you want to use inline styles for color
  },
  myEmptyStarStyle: {
    color: 'white',
  },
});
