import React  , {useState , useEffect}from 'react';
import { View, Text, TouchableOpacity, StyleSheet  , Alert,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URL } from '../const/const';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ToastAndroid } from 'react-native';


const HistoryItem = ({ item    , navigation,isCancel,setIsCancel}) => {
    const [dataUid, setDataUid] = useState('');
    // Tạo một chuỗi các tên món ăn, cách nhau bởi dấu phẩy
    const productNames = item.products.map(product => product.name).join(', ');
    const formatTime = (timeString) => {
        const date = new Date(timeString);
        const formattedTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        const formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        return `${formattedTime} ${formattedDate}`;
    };
    const getStatusText = (status) => {
        switch (status) {

            case 0:
                return 'Chờ xác nhận';
                case 1:
                    return 'Đã xác nhận';
            case 2:
                return 'Đang giao';
            case 3:
                return 'Đã giao';
            case 4:
            return 'Đã huỷ';
            default:
                return 'Trạng thái không xác định';
        }
    };
    const handlecancel = async () => {
      Alert.alert(
        'Cảnh báo!!',
        'Bạn có muốn hủy đơn hàng không?',
        [
          {
            text: 'Hủy',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Đồng ý',
            onPress: async () => {

              setIsCancel(!isCancel)
              const userId = await AsyncStorage.getItem('_id');
              console.log('userId: ', userId);
              console.log('voucherId : ' ,item.voucherId);
              // Giả sử bạn cũng lưu voucherId trong AsyncStorage hoặc lấy từ một nguồn nào đó
    
              try {
                // Lời gọi API đầu tiên để cập nhật trạng thái đơn hàng
                const apiUrl = `${URL}api/user/cancel`; // Thay thế bằng URL API cập nhật trạng thái đơn hàng với Order ID
                const response = await fetch(apiUrl, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({  orderId:item._id , 
                    userId:userId
                    // Thay thế bằng Order ID cần hủy
                  }),
                });
          
                if (response.ok) {
                  // Cập nhật trạng thái đơn hàng thành công
                  ToastAndroid.show('Hủy đơn hàng thành công', ToastAndroid.SHORT);

                    
                  console.log('Cập nhật trạng thái đơn hàng thành công');
                  
                } else {
                  // Xử lý lỗi nếu cần
                  const errorData = await response.json();
                  console.log('Lỗi cập nhật trạng thái đơn hàng:', errorData.msg);
                }
              } catch (error) {
                console.error('Lỗi khi gọi API cập nhật trạng thái đơn hàng:', error);
              }
    
                // Lời gọi API mới để hủy đơn hàng
                if(item.voucherId!=null){
                  console.log('đã vào đây');
                  await updateVoucher(userId)
                }
              }
                  
          
          },
        ],
        { cancelable: false }
      );
    }
    
    // Hàm để cập nhật trạng thái đơn hàng
    const updateVoucher =async (userId)=> {
      try {
        const apiUrl = `${URL}api/voucher/huydonhang`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId:userId, 
            voucherId:item.voucherId }),
        });

        if (response.ok) {
          console.log('Hoàn Voucher thành công');
        } else {
          console.log('Lỗi khi Hoàn Voucher');
      }
        
      } catch (error) {
        console.error('Lỗi:', error);
      }
     

    }
    
        

  

    const handledatlai = async ()=>{
        console.log("data products " , item.products);
        const dataUid = await AsyncStorage.getItem('_id');

        navigation.navigate('PayScreen' , {products: item.products,dataUid
          });
    }
    const handleDeital=async ()=>{
      console.log('item ' , item);
      navigation.navigate('Detailhistory' , { orderId: item._id });
    }

    return (
        <View >
        
        <TouchableOpacity style={styles.itemContainer} onPress={handleDeital}>
            <Image source={require('./../Image/iconaddm.png')} style={styles.image} />
            <View style={styles.item}>
              <Text style={styles.name}>{productNames}</Text>
              <Text style={styles.detail}>Mã ĐH: {item._id}</Text>
              <Text style={styles.detail}>Thời gian: {formatTime(item.time)}</Text>
              <Text style={styles.detail}>Phương thức thanh toán: {item.phuongthucthanhtoan}</Text>
              <Text style={styles.detail}>Trạng thái: {getStatusText(item.status)}</Text>
              <View style={styles.buttonContainer}>
                {item.status === 0 && (
                  <TouchableOpacity style={styles.buttonCancel} onPress={handlecancel}>
                    <Text style={styles.buttonText2}>Huỷ</Text>
                  </TouchableOpacity>
                )}
                {item.status === 1 || item.status === 2 && (
                  <TouchableOpacity style={styles.buttonLoad} onPress={() => {/* Thêm hành động khi nhấn nút */}}>
                    <Text style={styles.buttonText}>Đang Đá</Text>
                  </TouchableOpacity>
                )}
                {item.status === 3 && (
                  <TouchableOpacity style={styles.button} onPress={handledatlai}>
                    <Text style={styles.buttonText}>Đặt lại</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
  </TouchableOpacity>
</View>

    );
};

const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      alignItems: 'center', // Đảm bảo image và text align giữa
    },
    image: {
      width: 80,
      height: 80,
      marginRight: 10,
    },
    item: {
      flex: 1, // Cho phép component này mở rộng để chiếm phần còn lại của hàng
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5, // Giảm khoảng cách để button không rơi quá xa
    },
    detail: {
      fontSize: 14,
      color: '#555',
    },
    buttonContainer: {
      marginTop: 10, // Tạo khoảng cách từ text đến buttons
    },
    buttonCancel: {
      backgroundColor: '#D3D3D3',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonLoad: {
      backgroundColor: '#319AB4',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 5, // Tạo khoảng cách giữa các buttons
    },
    button: {
      backgroundColor: '#ffa500',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 5, // Tạo khoảng cách giữa các buttons
    },
    buttonText: {
      color: 'white',
    },
    buttonText2: {
      color: 'black',
    },
  });
  

export default HistoryItem;
