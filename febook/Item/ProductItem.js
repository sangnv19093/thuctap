import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const ProductItem = ({ product}) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => onUpdateQuantity(quantity - 1)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity onPress={() => onUpdateQuantity(quantity + 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.productPrice}>{product.price}đ</Text>
      <TouchableOpacity style={styles.removeButton}>
        <Text>x</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  productName: {
    flex: 2,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quantityButton: {
    fontSize: 20,
    width: 24,
    height: 24,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
  },
  quantityText: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  productPrice: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 10,
  },
});

export default ProductItem;
