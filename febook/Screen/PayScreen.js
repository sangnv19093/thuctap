import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckOrderModal from '../Modal/CheckOderModal';
import SuccessModal from '../Modal/SuccessModal';
import ProductItem from '../Item/ProductItem';
import ProductItemOder from '../Item/ProductItemOder';
import CurrentLocationMap from '../components/CurrentLocationMap';
import * as Location from 'expo-location';
import { URL } from '../const/const';
import ToolBar from '../components/ToolBar';
import Toast from 'react-native-toast-message';
import EditAddressModal from '../Modal/EditAddressModal';
import ListVoucherModal from '../Modal/ListVoucherModal';




const screenWidth = Dimensions.get('window').width;

const PayScreen = ({ route, navigation }) => {
  const { products, dataUid } = route.params;
  const [totalproduct, settotalproduct] = useState(0);
  const [orderData, setOrderData] = useState({});



  // const [address, setAddress] = useState('D29, Phạm Văn Bạch, Cầu Giấy, Hà Nội');
  // Sử dụng trạng thái cho quantity và totalPrice
  const [text, setText] = useState('');
  const deliveryFee = 35000;
  const [discount , setDiscount] = useState(0)

  const[IdVoucher , setDataIdVoucher] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' hoặc 'bank'

  const [isCheckOrderModalVisible, setCheckOrderModalVisible] = useState(false);
  const [isEditAddressModalVisible, setEditAddressModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isListVoucherModal, setIsListVoucherModal] = useState(false);
  const [voucher , setvoucher] = useState([])
    useEffect(()=>{
        console.log("ddataa restaurant" , products[0].restaurantId);
            const fetchData = async () => {
              try {
                const response = await fetch(URL+`api/voucher/getVoucherInRestaurant/${products[0].restaurantId}`);
                const jsonData = await response.json();
      
                const filteredVouchers = jsonData.list.filter(
                  (voucher) => voucher.quantity > 0
                );
                setvoucher(filteredVouchers)
              } catch (error) {
                console.error(error);
              }
            };
        
            fetchData();
    
       
        },[])

  //lấy vị trí hiện tại người dùng
  const [address, setAddress] = useState('Đang lấy vị trí...');
  console.log("products", products);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setAddress('Quyền truy cập vị trí bị từ chối.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync(location.coords);
      if (reverseGeocode.length > 0) {
        let addr = reverseGeocode[0];
        let fullAddress = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`;
        setAddress(fullAddress.replace(/, ,/g, ',').replace(/,,/g, ',').trim());
      }
    })();
  }, []);


  const createOrderData = () => {
    let totalPrice = 0;
    products.forEach(product => {
      totalPrice += product.price * product.quantity;
    });

    const orderData = {
      userId: dataUid, // Giả sử 'data' là userId của người dùng hiện tại
      address: address, // Địa chỉ giao hàng
      toltalprice: totalPrice + deliveryFee - discount, // Tính tổng tiền đơn hàng
      phuongthucthanhtoan: paymentMethod, // Phương thức thanh toán
      status: 0, // Trạng thái đơn hàng
      notes: text, // Ghi chú cho đơn hàng
      // Thêm thông tin sản phẩm nếu cần
      voucherId:IdVoucher,
      time: new Date(),
      products: products.map(product => ({
      restaurantId:product.restaurantId,
      productId: product.productId, // Giả sử mỗi sản phẩm có trường 'id'
      name: product.name, // Tên sản phẩm
      image:product.image,
      quantity: product.quantity, // Số lượng
      price: product.price // Giá sản phẩm
      })),

    };

    return orderData;
  };


  // Đơn hàng

  const sendOrderToServer = async (orderData) => {
    try {
      const response = await fetch(URL + 'api/history/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        // throw new Error(responseData.msg || 'Có lỗi xảy ra khi gửi đơn hàng.');
        Toast.show({
          type: 'info',
          text1: 'Lỗi đặt đơn hàng',
          text2: 'Vui lòng thử lại sau'
        });
        return;
      }

      console.log('Đơn hàng đã được tạo:', responseData);
      setTimeout(() => {
        setSuccessModalVisible(true);
      }, 200);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  // Và sau đó sử dụng trong hàm handleOrderPress
  const handleOrderPress = () => {
    const newOrderData = createOrderData();
    setOrderData(newOrderData);

    // if (address === 'Đang lấy vị trí...') {
    //   Toast.show({
    //     type: 'info',
    //     text1: 'Vui lòng chờ',
    //     text2: 'Đang lấy vị trí của bạn...'
    //   });
    //   return;
    // }


    if (paymentMethod === 'bank') {
      navigation.navigate('PaymentScreen', { orderData: newOrderData , products:products });
    } else {
      setCheckOrderModalVisible(true);
    }
  };



  //địa điểm
  const toggleEditAddressModal = () => {
    setEditAddressModalVisible(!isEditAddressModalVisible);
  };
  const toggleListVoucher = () => {
    setIsListVoucherModal(!isListVoucherModal);

    console.log("vào đây này" , isListVoucherModal);
  };
  const handleConfirmAddress = (newAddress) => {
    setAddress(newAddress); // Cập nhật địa chỉ mới
  };


  const toltalproducts = () => {
    var total = 0
    for (var i = 0; i < products.length; i++) {
      price = parseFloat(products[i].quantity * products[i].price)
      total += price
      console.log('giá: ', products[i].total);
    }
    console.log('====>tổng tiền: ', total);
    settotalproduct(total);
  };

  const ordertotalPrice = totalproduct + deliveryFee - discount;

  const goBack = () => {
    navigation.goBack();
  };
  


  // Sử dụng hook useEffect để cập nhật totalPrice mỗi khi quantity thay đổi
  useEffect(() => {
    toltalproducts()
    console.log("products: ", products);
    console.log("products user: ", dataUid);
  }, [products]);

  useEffect(() => {
    console.log("new orders", orderData);
  }, [orderData]);


  const handleConfirmVoucher =(data)=>{
      setDiscount(data)
  }

  const handleConfirmIDVoucher = (data)=>{
    setDataIdVoucher(data)
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToolBar
        title="Thanh Toán Đơn Hàng"
        onBackPress={() => navigation.goBack()}
      />
        {/* <View style={styles.warningContainer}>
                <Icon name="exclamation-triangle" size={24} color="#FFCC00" />
                <Text style={styles.warningText}>Bạn có thể bấm thay đổi địa điểm, khi cập nhật địa chỉ quá lâu!</Text>
            </View> */}

      <View style={styles.container}>
      
     
        <ScrollView >
        
          {/* <View style={styles.ngang}>
            <Text style={styles.deliveryText}>Giao hàng đến:</Text>
            <TouchableOpacity style={styles.buttondd} onPress={toggleEditAddressModal}>
            <Text>Thay đổi địa điểm</Text>
          </TouchableOpacity>
          <EditAddressModal
            isVisible={isEditAddressModalVisible}
            setIsVisible={setEditAddressModalVisible}
            onConfirmAddress={handleConfirmAddress}
          />

          </View>
          <Text style={styles.addressText}>{address}</Text>
          <View >
            <CurrentLocationMap />
          </View> */}

          {products.map(products => <ProductItemOder products={products} />)}
          <TouchableOpacity
              onPress={toggleListVoucher}
              style={{backgroundColor: '#319AB4', 
              padding: 5, 
              borderRadius: 5, 
              justifyContent: 'center', 
              alignItems: 'center', 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginBottom:20}}
              activeOpacity={0.7} // Cung cấp mức độ mờ khi nút được nhấn
            >
              <Text style={styles.buttonOrderText}>Lấy voucher</Text>
            </TouchableOpacity>
          <ListVoucherModal visible={isListVoucherModal}
          navigation={navigation}
          setisvisible={setIsListVoucherModal}
          products={voucher} 
          onConfirmVoucher={handleConfirmVoucher}
          onConfirmIDVoucher={handleConfirmIDVoucher}
          totals = {totalproduct}/>




          <View style={styles.containerHD}>
            <View style={styles.row}>
              <Text style={styles.label}>Đơn</Text>
              <Text style={styles.value}>{totalproduct}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cọc</Text>
              <Text style={styles.value}>{deliveryFee}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Khuyến mãi</Text>
              <Text style={styles.value}>{discount}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalValue}>{ordertotalPrice}đ</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: '', marginVertical: 10 }}>
            <RadioButton
              value="cash"
              status={paymentMethod === 'cash' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentMethod('cash')}
            />
            <Text style={{ marginHorizontal: 5 }}>Thanh toán bằng tiền mặt</Text>
            <Icon name="money" size={24} color="#319AB4" style={{ marginRight: 10 }} />



          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <RadioButton
              value="bank"
              status={paymentMethod === 'bank' ? 'checked' : 'unchecked'}
              onPress={() => setPaymentMethod('bank')}
            />
            <Text style={{ marginHorizontal: 5 }}>Thanh toán bằng VNPay</Text>
            <Image source={require('../Image/vnpay-logo2.jpg')} style={{ marginRight: 10, width: 45, height: 40 }} />
            {/* <Icon name="bank" size={24} color="#319AB4" style={{ marginRight: 10 }} /> */}



          </View>


          <View style={styles.inputText}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="chọn khung giờ"
              style={styles.textInput}
              multiline={true}
              numberOfLines={4} // Bạn có thể điều chỉnh số dòng tối đa theo mong muốn
            />

          </View>
          <TouchableOpacity
              onPress={handleOrderPress}
              style={styles.buttonOrder}
              activeOpacity={0.7} // Cung cấp mức độ mờ khi nút được nhấn
            >
              <Text style={styles.buttonOrderText}>Thanh toán</Text>
            </TouchableOpacity>
          <CheckOrderModal
            modalVisible={isCheckOrderModalVisible}
            setModalVisible={setCheckOrderModalVisible}
            orderData={orderData} // Truyền orderData
            onOrderSuccess={sendOrderToServer}
            products={products}
          />

          <SuccessModal
            isVisible={isSuccessModalVisible}
            navigation={navigation}
            products={products}
          />
 
        </ScrollView>
      </View>
      {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 9.5,
    padding: 0.05 * screenWidth,

  },
  header: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0.05 * screenWidth,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  ngang: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',


  },
  buttondd: {
    borderRadius: 15,
    backgroundColor: '#009966',
    padding: 10

  },
  arrowIcon: {
    width: 0.06 * screenWidth,
    height: 0.06 * screenWidth,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 0.06 * screenWidth,
    flex: 1,
    textAlign: 'center',
  },
  deliveryText: {
    fontSize: 0.04 * screenWidth,
    marginVertical: 0.02 * screenWidth,
  },
  addressText: {
    fontSize: 0.045 * screenWidth,
    fontWeight: 'bold',
    marginBottom: 0.025 * screenWidth,
  },
  productsContainer: {
    flexDirection: 'row',
    marginBottom: 0.025 * screenWidth,
    padding: 0.025 * screenWidth,
    alignItems: 'center',
  },
  productsImage: {
    width: 0.2 * screenWidth,
    height: 0.2 * screenWidth,
    marginRight: 0.04 * screenWidth,
  },
  productsName: {
    fontSize: 0.04 * screenWidth,
    flex: 1,
  },
  productsQuantity: {
    fontSize: 0.035 * screenWidth,
  },
  productsPrice: {
    marginLeft: 5,
    fontSize: 0.04 * screenWidth,
    fontWeight: 'bold',
  },
  totalPriceText: {
    fontSize: 0.045 * screenWidth,
    fontWeight: 'bold',
    marginBottom: 0.025 * screenWidth,
  },
  textInput: {
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 25 // Để đảm bảo văn bản bắt đầu từ phía trên trong Android
  },
  containerHD: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    margin: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonOrder: {
    backgroundColor: '#319AB4', 
    padding: 15, 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom:20
  },
  buttonOrderText: {
    color: 'white',
    fontWeight: 'bold', 
    fontSize: 16, 
  },

  warningContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 10, 
    backgroundColor: '#FFFBEA', 
    margin: 10, 
    borderRadius: 5,
},
warningText: {
    marginLeft: 10, 
    color: '#555', 
    fontSize: 10, 
},
});

export default PayScreen;
