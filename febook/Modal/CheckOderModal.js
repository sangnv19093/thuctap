import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { URL } from '../const/const';

const CheckOrderModal = ({ modalVisible, setModalVisible, onOrderSuccess,orderData   , products}) => {
  console.log("orderData trong CheckOrderModal: ", orderData);
  const orderSuccess = () => {
    setModalVisible(false);

    console.log("order data vc" , orderData);
    onOrderSuccess(orderData);
  };

  const goBack = () => {
    setModalVisible(false);
    // Additional actions if needed
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      presentationStyle="overFullScreen"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={goBack}>
            <Text style={styles.textStyle}>X</Text>
          </TouchableOpacity>
          <Image 
            source={require('../Image/giaohang.png')} 
            style={styles.image}
          />
          <Text>Kiểm tra mua hàng của bạn nhé...</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.customButton} onPress={goBack}>
              <Text style={styles.buttonText}>Kiểm tra</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.customButton, styles.orderButton]} onPress={orderSuccess}>
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',  // This aligns the modal to the bottom
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    backgroundColor: "white",
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderTopLeftRadius: 20,   // Add rounded corners at the top
    borderTopRightRadius: 20   // Add rounded corners at the top
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  textStyle: {
    fontWeight: 'bold',
    fontSize: 20
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  customButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center'
  },
  orderButton: {
    backgroundColor: '#FFD700'
  },
  buttonText: {
    fontWeight: 'bold'
  }
});

export default CheckOrderModal;
