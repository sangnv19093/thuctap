import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductItemOrder = ({ products , index }) => {
  useEffect(() => {
    console.log('=======> item', products);
  }, [products]);
  console.log('index',index);
  return (
    <View style={styles.itemContainer} key={index}>
      <Image source={{ uri: products.image }} style={styles.productImage} />

      <View style={styles.productDetailsContainer}>
        <Text style={styles.productName}>{products.name}</Text>

        {/* <Text style={styles.quantityText}>Số lượng: {products.quantity}</Text> */}
      </View>

      <Text style={styles.productPrice}>{products.price}đ</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10, 
  },
  productDetailsContainer: {
    flex: 1, 
    justifyContent: 'center', 
    marginLeft: 10, 
  },
  productName: {
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#319AB4', 
  },
});

export default ProductItemOrder;
