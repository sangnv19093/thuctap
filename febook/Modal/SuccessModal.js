import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../const/const';

const SuccessModal = ({ isVisible, navigation, products}) => {
  const deleteProduct = async (Uid) => {
    try {
      const productIdsToDelete = products.map((product) => product._id);
      console.log("data order id", productIdsToDelete);
      const apiUrl = `${URL}api/deletebyUid/${Uid}`; // Thay thế bằng URL API xóa sản phẩm
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listorderIds: productIdsToDelete }),
      });

      if (response.ok) {
        // Xóa sản phẩm thành công  
        console.log('Xóa sản phẩm thành công');
      } else {
        // Xử lý lỗi nếu cần
        const errorData = await response.json();
        console.log('Lỗi xóa sản phẩm:', errorData.msg);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API xóa sản phẩm:', error);
    }
  };


  const goHome = async () => {
    const storedUserId = await AsyncStorage.getItem('_id');

    deleteProduct(storedUserId)
    //console.log("data products", products);
    navigation.navigate('Home')

    
  };
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.container}>
        <Image source={require('../Image/logosan.jpg')} style={styles.image} />
        <Text style={styles.heading}>BẠN ĐÃ ĐẶT HÀNG</Text>
        <Text style={styles.subheading}>THÀNH CÔNG</Text>
        <Text style={styles.instruction}>Kiểm tra đơn hàng của bạn trong mục "Lịch sử đơn hàng"!</Text>
        <TouchableOpacity style={styles.button} onPress={goHome}>
          <Text style={styles.buttonText}>TRANG CHỦ</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  image: {
    width: 200,
    height: 170,  // Giảm chiều cao ảnh xuống
    marginBottom: 10,  // Giảm khoảng cách dưới ảnh
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 5,
  },
  instruction: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',

    marginHorizontal: 10,  // Tăng khoảng cách ngang để văn bản không sát biên
  },
  button: {
    marginTop: 15,  // Giảm khoảng cách trên nút
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SuccessModal;
