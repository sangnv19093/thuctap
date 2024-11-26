import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import CryptoJS from 'crypto-js';
import * as Network from 'expo-network';
import { WebView } from 'react-native-webview';
import { URL } from '../const/const';
import SuccessModal from '../Modal/SuccessModal';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const PaymentScreen = ({ route, navigation }) => {
  const {  products } = route.params;
  const { orderData } = route.params;
  const totalPrice = orderData.toltalprice;
  const [paymentUrl, setPaymentUrl] = useState('');
  const [encodedDateTime, setEncodedDateTime] = useState('');
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const vnp_TmnCode = '25QCPEV0';
  const vnp_HashSecret = '7QMLFPSU05CLBIUK168H1E8MCKUUA59R';
 


  const sendOrderToServer = async () => {
      console.log('data products2222' , products);

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
            throw new Error(responseData.msg || 'Có lỗi xảy ra khi gửi đơn hàng.');
        }

        console.log('Đơn hàng đã được tạo:', responseData);

        // Đặt timeout để hiển thị modal sau 3 giây
        setTimeout(() => {
            setSuccessModalVisible(true);
        }, 1500);
    } catch (error) {
        console.error('Error:', error);
    }
};


   // Hàm lấy thời gian bắt đầu
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  //// Hàm lấy thời gian kết thúc
  const getExpireDateTime = (offsetMinutes = 30) => {
    // Tạo ra một đối tượng ngày mới với thời gian hiện tại
    const now = new Date();
  
    // Thêm offset (ví dụ: 30 phút) vào thời gian hiện tại
    now.setMinutes(now.getMinutes() + offsetMinutes);
  
    // Định dạng thời gian theo yêu cầu: yyyyMMddHHmmss
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };


  const generateRandomNumberString = (length) => {
    let randomString = '';
    while (randomString.length < length) {
      // Tạo một số ngẫu nhiên và loại bỏ phần '0.' ở đầu
      randomString += Math.random().toString().slice(2);
    }
    // Cắt chuỗi để có độ dài mong muốn và trả về
    return randomString.substr(0, length);
  };
///
const generateEncodedDateTime = () => {
  // Current date and time
  const currentDateTime = new Date();

  // Format the date and time in the desired format
  const formattedDateTime = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}-${currentDateTime.getDate().toString().padStart(2, '0')} ${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}:${currentDateTime.getSeconds().toString().padStart(2, '0')}`;

  // Construct the original string with the current date and time
  const originalString = `Thanh toan don hang thoi gian: ${formattedDateTime}`;

  // URL encode the string, replacing spaces with plus signs
  const encodedString = encodeURIComponent(originalString).replace(/%20/g, '+');

  console.log("Encoded DateTime: " + encodedString);
  setEncodedDateTime(encodedString);
  return encodedString;
};


  useEffect(() => {
    // Hàm lấy địa chỉ IP và cập nhật trạng thái
    const fetchIpAddress = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
      } catch (e) {
        console.error(e);
      }
    };
  
    fetchIpAddress();
  }, []);
   useEffect(() => {
    const createPaymentUrl = () => {
      // Tạo các tham số cơ bản cho giao dịch
       // Các thông số cần thiết cho URL
  const vnp_Params = {
    vnp_Amount: totalPrice*100,
    vnp_BankCode: 'VNBANK',
    vnp_Command: 'pay',
    vnp_CreateDate: getCurrentDateTime(),
    vnp_CurrCode: 'VND',
    vnp_ExpireDate: getExpireDateTime(),
    vnp_IpAddr: ipAddress,
    vnp_Locale: 'vn',
    vnp_OrderInfo: generateEncodedDateTime(),
    vnp_OrderType: 'food',
    vnp_ReturnUrl: 'https%3A%2F%2Fsandbox.vnpayment.vn%2Ftryitnow%2FHome%2FVnPayReturn',
    vnp_TmnCode: vnp_TmnCode,
    vnp_TxnRef: generateRandomNumberString(6),
    vnp_Version: '2.1.0'
    // vnp_SecureHash sẽ được thêm sau khi tạo chuỗi băm
  };

      // Sắp xếp các tham số theo thứ tự alphabet
      const sortedKeys = Object.keys(vnp_Params).sort();
      let signData = sortedKeys.map(key => `${key}=${vnp_Params[key]}`).join('&');

      // Tạo chuỗi băm
      const secureHash = CryptoJS.HmacSHA512(signData, vnp_HashSecret).toString(CryptoJS.enc.Hex);
      const paymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${signData}&vnp_SecureHash=${secureHash}`;

      return paymentUrl;
    };

    const url = createPaymentUrl();
    console.log("giá" ,totalPrice);
    console.log("giá 222" ,orderData);
    console.log(url);
    
    // console.log(products);
    setPaymentUrl(url);
  }, [ipAddress,totalPrice, products]);

  

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        
      <TouchableOpacity onPress={sendOrderToServer} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
        <Text style={styles.goBackButtonText}>Huỷ</Text>
      </TouchableOpacity>

      </View>
      <SuccessModal
            isVisible={isSuccessModalVisible}
            navigation={navigation}
            products={products}
          />
      <View style={styles.paymentInfoContainer}>
        {paymentUrl ? (
          <WebView
            source={{ uri: paymentUrl }}
            style={styles.webView}
          />
        ) : (
          <Text>Đang tạo URL thanh toán...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width:'100%',
    borderBottomWidth: 1, // Thêm đường line ở cuối
    borderBottomColor: '#ddd', // Màu của đường line
    backgroundColor: 'transparent', // Loại bỏ màu nền
    
  },
  goBackButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    margin:10
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  confirmButtonText: {
    fontWeight: 'bold', // Đặt độ đậm cho chữ
    fontSize: 16,       // Đặt kích thước cho chữ
    color: 'white',
    textAlign: 'center',
  },
  goBackButtonText: {
    fontWeight: 'bold', // Đặt độ đậm cho chữ
    fontSize: 16,       // Đặt kích thước cho chữ
    color: 'white',     // Màu chữ, bạn có thể thay đổi nếu cần
    textAlign: 'center',
  },
  
  paymentInfoContainer: {
    alignItems: 'center',
    padding: 10
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  webView: {
    width: screenWidth,
    height: screenHeight * 0.8, // You can adjust the height as needed
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
},
confirmButtonText: {
    color: 'white',
    textAlign: 'center',
},
});

export default PaymentScreen;