import { StyleSheet, Text, View, Dimensions , TouchableOpacity , ScrollView , Image } from "react-native";
import React , {useState , useEffect} from "react";

import { URL } from '../../const/const';
const { width, height } = Dimensions.get("window");
const MenuRestaurant = ({navigation , data }) => {
    const [datamenu , setdata] = useState([])


    useEffect(()=>{
      const fetchData = async () => {
        try {
          const response = await fetch(`${URL}api/product/getProductsInRestaurant/${data}`);
          const jsonData = await response.json();
        
            setdata(jsonData.data)

        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();

      console.log("data mơi s vào màn hình", data);

   
     
    },[])
  return (
    <View style={styles.headermenu}>
      <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold"  , paddingTop:20}}>Các Sân</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
                {datamenu.map((data, index) => (
                    <View key={index} style={styles.menuItem}>
                        <Image source={{ uri: data.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemText}>{data.name}</Text>
                            <Text style={styles.itemText}>Giá: {data.realPrice}đ</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ProductDetail', { product: data })}
                            style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
    </View>
  );
};

export default MenuRestaurant;

const styles = StyleSheet.create({
  headermenu: {
    top: 0.01 * height,
    margin: 15,
},
menuItem: {
    marginTop: 10,
    width: 0.92 * width,
    height: 0.1 * height,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Added padding for inner spacing
},
itemImage: {
    height: height * 0.1,
    width: width * 0.2,
    borderRadius: 10,
},
itemDetails: {
    flex: 1, // Added flex to take available space
    paddingHorizontal: 10, // Added padding for inner spacing
},
itemText: {
    fontWeight: 'bold',
    color: '#616161',
},
addButton: {
    width: 0.06 * width,
    height: 0.03 * height,
    borderRadius: 20,
    backgroundColor: '#616161',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10, // Adjusted for spacing from the details
},
addButtonText: {
    color: 'white',
    fontWeight: 'bold',
},
});
