import React, { useState, useReducer, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../Component/CartContext'; // Import the useCart hook
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { deleteproduct, updatecartproduct } from '../Redux/ActionAddtoCart';
import { CheckBox } from 'react-native-elements';
import Toast from 'react-native-toast-message';
import { URL } from '../const/const';
import { useFocusEffect } from '@react-navigation/native';
const OrderScreen = ({ navigation, route }) => {
  const { state, dispatch } = useCart(); // Get the cart state and dispatch
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [dataUid, setDataUid] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [products, setProducts] = useState([]);
  const [selectedProductIndexes, setSelectedProductIndexes] = useState([]);

  const [selectallProducts, setSelectAllProducts] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState([]);


  const isFocused = useIsFocused();

  const dispathDeleteProductFromCart = useDispatch();


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedUserId = await AsyncStorage.getItem('_id');

        if (storedUsername && storedUserId) {

          // setIsLoggedIn(true);
          setCurrentUser({ username: storedUsername, _id: storedUserId });
          console.log("User name:", storedUsername);
          console.log("User ID:", storedUserId); // Log giá trị của userId
          // console.log("Is Logged In:", true);    // Log trạng thái đăng nhập là true
        } else {
          console.log("User ID:", storedUserId);
          // console.log("Is Logged In:", false);   // Log trạng thái đăng nhập là false
        }

      } catch (error) {
        console.error('Error retrieving stored data:', error);
      }
    };

    checkLoginStatus();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('_id'); // Thay 'key' bằng khóa lưu trữ của bạn
        if (storedData !== null) {
          const isLogin = await AsyncStorage.getItem('isLogin');
          if (isLogin === 'true') {
            setIsLoggedIn(true)
            setDataUid(storedData);
            console.log("vào đây vào log", dataUid)
          }

        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData()
  }, []);





  const fetchDataOder = async () => {

    const storedData = await AsyncStorage.getItem('_id');
    try {
      const response = await fetch(`${URL}api/order`)
      const jsonData = await response.json();
      const datafilter = jsonData.filter((obj, index) =>
        obj.userId === storedData
      )


      const updatedProducts = datafilter.map((product) => ({
        ...product,
        ischecked: false,
      }));
      console.log("vào đây log data order data fillter", updatedProducts)
      setProducts(updatedProducts);



    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFocused) {
      // Gọi hàm tải dữ liệu tại đây
      setSelectAllProducts(false)
      fetchDataOder()


    }
  }, [isFocused]);

  useEffect(() => {

  }, [])
  // useEffect(() => {

  // const getDataFromAsyncStorage = async (key, id) => {
  //   // try {
  //     // const jsonData = await AsyncStorage.getItem(key);
  //     // if (jsonData) {
  //     //   const dataArray = JSON.parse(jsonData);
  //     //   const filteredData = dataArray.filter((obj) => obj.idusser === id);
  //     //   setProducts(filteredData)


  //     // }

  //   // } catch (error) {
  //   //   console.log('Error retrieving data: ', error);
  //   // }
  // };
  // getDataFromAsyncStorage('products' , dataUid)
  // }, []);


  useEffect(() => {
    calculateTotalPrice();

  }, [products])
  useEffect(() => {
  }, [])

  // Function to calculate the total price
  const calculateTotalPrice = () => {
    let total = 0;
    if (products && products.length >= 0) {
      products.forEach((product) => {
        if (product.ischecked == true) {
          total += (product.price * product.quantity);
        }
      });



      setTotalPrice(total);
    }
  };
  // const filterProductsByChecked = (products) => {
  //  return  products.filter(product => product.ischecked ==true);




  // };
  const checkout = () => {
    // Create an array of product details
    // console.log('Checkout', products);

    const areAllChecked = products.every((product, index, array) => product.ischecked === false

    )

    console.log("dataa allllllllllllsdasdasdhahsdasjd", areAllChecked);

    if (areAllChecked == true) {
      alert("vui lòng lựa chọn Sân bóng")
      return
    }
    const selectedProducts = products.filter((product) => product.ischecked);
    navigation.navigate('PayScreen', { products: selectedProducts, dataUid });


  };
  const handleCheckoutPress = () => {
    if (products.length === 0) {
      Alert.alert(
        'Yêu Cầu',
        'Vui lòng thêm món vào giỏ hàng! Hãy đến của hàng để gọi món ngay thôi nào!',
        [
          { text: 'Home', onPress: () => navigation.navigate('Home') }, // Replace 'HomeScreen' with the actual home screen route name
          { text: 'Cancel', style: 'cancel' },
        ],
      );
      return
    }
    checkout();




  };

  //method delete product from order 
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${URL}api/deleteorder/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        fetchDataOder()
      } else {
        const errorData = await response.json();
        console.error(errorData); // In thông báo lỗi từ API
      }
    } catch (error) {
      console.error(error); // In lỗi nếu có lỗi xảy ra
      // Xử lý lỗi
      // ...
    }
  };



  const deleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      'Do you want to remove this item from the cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            console.log(product._id)
            deleteOrder(product._id)

            calculateTotalPrice()
          },
        },
      ]
    );
  };

  /////update order
  const updateOrder = async (orderId, quantity) => {
    try {
      const response = await fetch(`${URL}api/updateorder/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Cập nhật đơn hàng không thành công');
      }

      const dataorderupdate = await response.json();
      return dataorderupdate;
    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây
    }
  };
  const Updateischecked = async (orderId, ischecked) => {
    try {
      const response = await fetch(`${URL}api/updateischecked/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ischecked })
      });

      if (!response.ok) {
        throw new Error('Cập nhật đơn hàng không thành công');
      }

      const dataorderupdate = await response.json();
      return dataorderupdate;
    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây
    }
  };

  const incrementQuantity = async (product, index) => {
    try {
      console.log("id cart product", product._id);

      const quantityproducts = product.quantity;
      const dataupdate = quantityproducts + 1;

      console.log("data update", quantityproducts)
      const updatedOrder = await updateOrder(product._id, dataupdate);
      // Sử dụng updatedOrder trong ứng dụng của bạn
      console.log("data after update", updatedOrder);
      fetchDataOder()

    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây
    }







    calculateTotalPrice();
  };

  const decrementQuantity = async (product) => {

    try {
      console.log("id cart product", product._id);

      const quantityproducts = product.quantity;
      if (quantityproducts > 1) {
        const dataupdate = quantityproducts - 1;
        console.log("data update", quantityproducts)
        const updatedOrder = await updateOrder(product._id, dataupdate);
        // Sử dụng updatedOrder trong ứng dụng của bạn
        console.log("data after update", updatedOrder);
        fetchDataOder()
      } else {
        alert("số lượng phải lớn hơn 0")
      }



    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây
    }
    calculateTotalPrice();


  };

  // const toggleProductSelection = (index)=>{
  //     console.log("indexx checkbox" , index)
  // }




  const toggleProductSelection = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      ischecked: !updatedProducts[index].ischecked,
    };
    setProducts(updatedProducts);

    const areAllChecked = updatedProducts.every((product, index, array) => product.ischecked === true

    )

    if (areAllChecked == true) {
      setSelectAllProducts(true)
    } else {
      setSelectAllProducts(false)
    }

  };
  const updateSelectAllProducts = () => {

    if (products.length == 0) {
      alert("không có sản phẩm trong giỏ hàng")
      return
    }
    const updatedProducts = products.map((product) => ({
      ...product,
      ischecked: !selectallProducts,
    }));
    setProducts(updatedProducts);
    setSelectAllProducts(!selectallProducts);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./../Image/Logo_BeeFood.png')} style={styles.logo} />
        <Text style={styles.title}>Danh sách sân đã chọn</Text>
      </View>
      {isLoggedIn ? (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.sectionTitle}>Selected</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.sectionTitle}>Select all</Text>
              <CheckBox
                checked={selectallProducts}
                onPress={() => updateSelectAllProducts()}
              />
            </View>
          </View>
          <ScrollView>
            {products && products.length > 0 ? (products.map((product, index) => (
              <View key={index} style={styles.productContainer}>
                <CheckBox
                  checked={product.ischecked}
                  onPress={() => toggleProductSelection(index)}

                />
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={{ flexDirection: 'column', flex: 1 }}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price * product.quantity} VND</Text>
                </View>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decrementQuantity(product)}>
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{product.quantity}</Text>
                  <TouchableOpacity onPress={() => incrementQuantity(product, index)}>
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.deleteButtonContainer}>
                  <TouchableOpacity onPress={() => deleteProduct(product)}>
                    <Image source={require('./../Image/delete-icon.png')} style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </View>
            ))) : <View style={styles.emptyCartContainer}>
              <Text style={styles.emptyCartText}>Danh sách của bạn đang trống.</Text>
            </View>}
          </ScrollView>

          <View style={styles.bottomRow}>
            <Text style={styles.totalPrice}>Total: {totalPrice} VND</Text>
            <TouchableOpacity style={[styles.button, styles.bottomButton]} onPress={handleCheckoutPress}>
              <Text style={styles.buttonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // If the user is not logged in, show this message instead
        <View style={styles.loginPrompt}>
          <Text style={styles.promptText}>
            Bạn vui lòng đăng nhập để thêm sân!{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('LoginScreen')}>
              Đăng nhập ngay!
            </Text>
          </Text>
        </View>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 70,
    height: 50,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10, // Add borderRadius for rounded corners
  },

  productContainer: {
    margin: 15,
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    justifyContent: 'flex-start', // Adjust to align items horizontally
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },

  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#616161',
    alignSelf: 'center', // Align center with the image
  },

  productPrice: {
    color: '#319AB4',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center', // Align center with the image
  },
  productContainer: {
    margin: 15,
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#616161',
  },
  productPrice: {
    color: '#319AB4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FF4500',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    paddingHorizontal: 8,
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default OrderScreen;
