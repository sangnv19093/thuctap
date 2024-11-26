import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './Screen/Home';
import OrderScreen from './Screen/OrderScreen';
import { Provider } from 'react-redux';

import San5Component from './Component/San5Component';
import ComxuatComponent from './Component/ComxuatComponent';
import BunPhoComponent from './Component/BunPhoComponent';



import AllProducts from './Screen/AllProducts';
import AllRestaurnat from './Screen/AllRestaurnat';
import RestaurantScreen from './Screen/RestaurantScreen';
import ProductDetailScreen from './Screen/ProductDetailScreen';
import AppNavigator from './Screen/AppNavigator';
import NotificationScreen from './Screen/NotificationScreen';
import ProfileScreen from './Screen/ProfileScreen';
import SearchComponent from './Component/SearchComponent';
import RegisterScreen from './Screen/RegisterScreen';
import SplashScreen from './Screen/SplashScreen';
import LoginScreen from './Screen/LoginScreen';
import ProductsFavorite from './Screen/ProductsFavorite';
import PayScreen from './Screen/PayScreen';
import HistoryScreen from './Screen/HistoryScreen';
import History from './profile/History';
import Detailhistory from './profile/Detailhistory';
import Toast from 'react-native-toast-message';
import UserInfor from './UserInfor';
import ProfileInfor from './profile/ProfileInfor';

import store from './Redux/StoreAddToCart';
import { CartProvider } from './Component/CartContext';
import PaymentScreen from './Service/PaymentScreen';
const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>

                <CartProvider>
                    <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
                        <Stack.Screen
                            name="History"
                            component={HistoryScreen}
                            options={{ title: 'Lịch sử' }}
                        />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ title: 'HELLO' }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ title: 'Đăng ký' }}
                        />
                        <Stack.Screen name="PayScreen" component={PayScreen} options={{ title: 'Thanh toán' }} />

                        <Stack.Screen name='Appnavigator' component={AppNavigator} />
                        <Stack.Screen component={SearchComponent} name='Search' />
                        <Stack.Screen component={San5Component} name='Ganban' />
                        <Stack.Screen component={ComxuatComponent} name='Comxuat' />
                        <Stack.Screen component={BunPhoComponent} name='BunPho' />

                        <Stack.Screen component={ProductDetailScreen} name='ProductDetail' options={{ title: 'Chi tiết sản phẩm' }} />
                        <Stack.Screen component={ProfileInfor} name='ProfileInfor' />



                        <Stack.Screen component={ProductsFavorite} name='ProductFavoriteScreen' />
                        <Stack.Screen component={UserInfor} name='UserInfor' />
                        <Stack.Screen component={SplashScreen} name='SplashScreen' />
                        <Stack.Screen component={AllProducts} name='AllProducts' />

                        <Stack.Screen component={RestaurantScreen} name='Restaurant' screenOptions={{
                            unmountOnBlur: true,
                        }} />

                        <Stack.Screen component={PaymentScreen} name='PaymentScreen' />
                        <Stack.Screen component={AllRestaurnat} name='AllRestaurant' />

                        <Stack.Screen component={History} name='lichsu' />
                        <Stack.Screen component={Detailhistory} name='Detailhistory' />

                    </Stack.Navigator>
                </CartProvider>
            </NavigationContainer>
            <Toast />
        </Provider>
    );
}
