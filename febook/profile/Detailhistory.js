import {React,useEffect,useState} from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import ToolBar from '../components/ToolBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../const/const';
import ProductItemOrder from '../Item/ProductItemOder';
import Stars from 'react-native-stars'; // Import from FontAwesome
import Toast from 'react-native-toast-message';

const Detailhistory = ({ route, navigation }) => {
    const { orderId } = route.params; // Get the orderId passed via navigation
    const [orderDetails, setOrderDetails] = useState(null);
    const deliveryFee = 35000;
    const discount = 0;
    const [showRating, setShowRating] = useState(false);
    const [starRating, setStarRating] = useState(5);

    // Lấy userId từ AsyncStorage
    const getStatusLabel = (status) => {
      switch (status) {
          case 0:
              return 'Chờ xác nhận';
          case 1:
              return 'Đã xác nhận';
          case 2:
              return 'Đang Đá';
          case 3:
              return 'Đã xong';
          case 4:
              return 'Đã huỷ';
          default:
              return 'Trạng thái không xác định';
      }
  };

    
    useEffect(() => {
      const fetchOrderDetails = async () => {
          try {
              console.log('id:', orderId);
              const response = await fetch(`${URL}api/don-hang/${orderId}`);
              const data = await response.json();
              console.log('data:', data);
              setOrderDetails(data); // Lưu trữ đối tượng JSON trực tiếp
          } catch (error) {
              console.error('Error fetching order details:', error);
          }
      };
      console.log('done',orderDetails);
      if (!orderDetails) { // Chỉ fetch khi orderDetails là null hoặc undefined
          fetchOrderDetails();
      }
  }, [orderId]);

  const calculateTotalPurchase = (products) => {
    return products.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  };
  const goHome = async() => {
      navigation.navigate('Home')
    };

    //hien thi view danh gia
  const toggleRatingView = () => {
    setShowRating(!showRating);
  };

  const submitStar = async () => {
    const storedData = await AsyncStorage.getItem('_id');
    console.log("id user", storedData);
    console.log("id nh", orderDetails.products[0].restaurantId._id);
    // const isLogin = await AsyncStorage.getItem('isLogin');
  
   
    console.log("Star Rating", starRating);
    const apiUrl = `${URL}api/evaluate`;
  
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurantId: orderDetails.products[0].restaurantId._id,
        star: starRating // Use the starRating state here
      })
    })
    .then(async response => {
      const data = await response.json();
      if (response.ok) {
        // Handle success
        console.log("Success:", data);
        Toast.show({
          type: 'success',
          text1: 'Cảm ơn bạn đã đánh giá sản phẩm',
        });
      } else {
        // Handle server errors
        console.log("Server Error:", data);
        Toast.show({
          type: 'error',
          text1: 'Đánh giá thất bại',
          text2: data.message,
        });
        throw new Error(data.message || "Lỗi mạng hoặc máy chủ");
      }
    })
    .catch(error => {
      console.error("Có lỗi khi đánh giá", error);
      Toast.show({
        type: 'error',
        text1: 'Đánh giá thất bại',
        text2: error.toString(),
      });
    });
  };


  return (
    <View style={{flex:1}}>
    <ToolBar title="Thông tin" onBackPress={() => navigation.goBack()} />
    {orderDetails && ( 
                <>
    <ScrollView >
      <View style={styles.orderDetails}>
        <Text style={styles.orderStatus}>VSN Website</Text>
        <Text style={styles.orderStatus}>Trạng thái: {getStatusLabel(orderDetails.status)}</Text>
        <Text style={styles.orderNumber}>Đơn hàng: B-{orderDetails._id}</Text>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.restaurantAddress}>{orderDetails.products[0].restaurantId.name}</Text>
        <Image
                source={require("./../Image//downarrow.png")}
                style={styles.icon}
              />
              
        {/* <Text style={styles.deliveryAddress}>Địa điểm đến: {orderDetails.address}</Text> */}
      </View>
      <View style={styles.foodItemContainer}>
      {orderDetails.products.map((product, index) => (
         <ProductItemOrder products={product} index={index}/>
        ))}

      </View>
      
        <View style={styles.containerHD}>
            <View style={styles.row}>
              <Text style={styles.label}>Đơn mua</Text>
              <Text style={styles.value}>{calculateTotalPurchase(orderDetails.products)}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Cọc</Text>
              <Text style={styles.value}>{deliveryFee}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Khuyến mãi</Text>
              <Text style={styles.value}>{!orderDetails.voucherId?.money?0:orderDetails.voucherId?.money}đ</Text>
              {/* {!!orderDetails.voucherId?.money ? 
      <Text> 0d</Text>
      :
      <Text> {orderDetails.voucherId?.money}</Text>
    } */}
            </View>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalValue}>{orderDetails.toltalprice}đ</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.totaltt}>Phương thức thanh toán</Text>
              <Text style={styles.totaltt}>{orderDetails.phuongthucthanhtoan}</Text>
            </View>
          </View>
          
      

      <View style={styles.helpContainer}>
      
            
            

      {orderDetails && orderDetails.status === 3 && (
                <>
                <TouchableOpacity onPress={toggleRatingView}>
                  <View style={{flexDirection:'row',justifyContent: 'center',alignItems:'center'}}>
                  <Text style={styles.buttonText2}>Đánh giá</Text>
                  <Image
                      source={require("./../Image//downarrow.png")}
                      style={styles.icon}
                    />
                    </View>
                </TouchableOpacity>
                  {showRating && (
                    <View style={{ alignItems: 'center' }}>
                      <Stars
                        default={5}
                        count={5}
                        half={false} 
                        update={(val)=>{ setStarRating(val) }}
                        starSize={50}
                        fullStar={<Icon name={'star'} size={50} style={[styles.myStarStyle, { color: 'yellow' }]}/>}
                        emptyStar={<Icon name={'star-o'} size={50} style={[styles.myStarStyle, { color: 'blue' }]}/>}
                      />
                      <TouchableOpacity
                        style={[styles.button, styles.bottomButton]}
                        onPress={submitStar}
                      >
                        <Text style={styles.buttonText}>Gửi</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                </>
              )}


        
        <TouchableOpacity style={styles.reorderButton} onPress={goHome}>
          <Text style={styles.reorderButtonText}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
   
    </>
   
            )}
            <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  orderHeader: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  orderDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  orderStatus: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  orderNumber: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  driverTextContainer: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  driverDetails: {
    fontSize: 14,
    color: '#646464',
  },
  addressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  restaurantAddress: {
    fontSize: 16,
    color: '#000',
    fontWeight:'bold'
  },
  deliveryAddress: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
    fontWeight:'bold'
  },
  distance: {
    fontSize: 16,
    color: '#646464',
    marginTop: 4,
  },
  foodItemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  foodItem: {
    fontSize: 16,
    color: '#000',
  },
  foodItemNote: {
    fontSize: 14,
    color: '#646464',
    marginTop: 4,
  },
  paymentInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  paymentAmount: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  paymentTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  paymentMethod: {
    fontSize: 16,
    color: '#4CAF50',
    marginTop: 8,
  },
  receiptButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  receiptButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  helpContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  helpButton: {
    padding: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  helpButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    
  },
  reorderButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center', // This aligns the text within the Text component
  },
  reorderButton: {
    justifyContent: 'center', // This centers the content vertically in the button
    alignItems: 'center', // This centers the content horizontally in the button
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFC107',
    borderRadius: 4,
    marginHorizontal: 30,
    marginTop: 16,
    marginBottom: 16,
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
  totaltt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText2: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#319AB4',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    margin: 5,

  },
  
});

export default Detailhistory;
