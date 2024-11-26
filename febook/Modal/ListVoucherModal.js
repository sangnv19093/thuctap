import { Modal, View, Text, TouchableOpacity, StyleSheet , ScrollView , Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
const { width, height } = Dimensions.get('window');
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import ToolBar from '../components/ToolBar';
const modalHeight = height * 2 / 3; // 2/3 chiều cao màn hình
const modalWidth = width;
const ListVoucherModal = ({visible ,products  , setisvisible, navigation  , totals , onConfirmVoucher , onConfirmIDVoucher}) => {
  const [datadiscount , setdatadiscount] = useState({})

    const getdatadiscount = async (data)=>{
     
      const storedData = await AsyncStorage.getItem('_id'); 
        console.log("data fdsfdsfu" , data.idUser);

        const   checkuid  =  data.idUser.includes(storedData)
      setdatadiscount(data)
      if(data.quantity==0){
        Toast.show({
          type: 'error',
          text1: 'Thông báo!',
          text2: 'Số lượng voucher đã hết',
        });
        setisvisible(false)
        onConfirmVoucher(0)
        onConfirmIDVoucher(null)
        return
      }
      if(checkuid){
        Toast.show({
          type: 'error',
          text1: 'Thông báo!',
          text2: 'Bạn đã sử dụng Voucher này rồi',
        });

        setisvisible(false)
        onConfirmVoucher(0)
        onConfirmIDVoucher(null)
        return
      }else{
        if(data.limit<=totals){
          setisvisible(false)
          onConfirmVoucher(data.money)
          onConfirmIDVoucher(data._id)
          console.log('Voucher',data._id);
          console.log("data money" , data.money);
        }else{
          Toast.show({
            type: 'error',
            text1: 'Thông báo!',
            text2: 'Đơn hàng không đủ điều kiện sử dụng voucher',
          });
          setisvisible(false)
          onConfirmVoucher(0)
          onConfirmIDVoucher("657f05afdd3c0fb642e1eb00")
        }
      }
      
      
      }
    
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => setisvisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setisvisible(false)}>
                <Text style={styles.closeIcon}>X</Text>
              </TouchableOpacity>
              <Text style={styles.voucherText2}>Voucher Cửa Hàng</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {products.length > 0 ? (
                  products.map((data, index) => (
                    <View key={index} style={styles.voucherItem}>
                      <View style={styles.voucherInfo}>
                        <Text style={styles.voucherText}>
                          Giảm {Math.round(data.money / 1000)}k cho đơn từ {Math.round(data.limit / 1000)}k
                        </Text>
                        <Text style={styles.voucherText}>
                          HSD: {moment(data.HSD).format('DD/MM/YYYY')}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => getdatadiscount(data)}
                        style={styles.applyButton}
                      >
                        <Text style={styles.applyButtonText}>Áp dụng</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noVoucherText}>Cửa hàng hiện tại không có khuyến mãi</Text>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
                }      

export default ListVoucherModal

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    height: modalHeight,
    width: modalWidth-10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  voucherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    width: modalWidth - 80, 
  },
      voucherInfo: {
        flex: 1, 
        marginRight: 10, 
      },
      voucherText: {
        flexShrink: 1, 
        fontWeight: 'bold',
        color: '#616161',
      },
      applyButton: {
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 10,
        backgroundColor: '#319AB4',
      
        width: 80,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
      voucherText2:{
        flexShrink: 1, // Cho phép text này thu nhỏ
        fontWeight: 'bold',
        color: 'green', //
      },
      closeButton: {
        position: 'absolute',
        top: 5,
        right: 10, 
        padding: 10,
        zIndex: 10, 
      },
      closeIcon: {
        fontSize: 28,
        color: '#000',
        
      },
      noVoucherText: {
    fontSize: 16,
    color: '#616161',
    textAlign: 'center',
    marginTop: 20,
  },
})