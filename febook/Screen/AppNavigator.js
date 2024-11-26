import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import OrderScreen from './OrderScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ProductsFavorite from './ProductsFavorite';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconType = 'regular'; // Dạng viền cho các icon
          switch (route.name) {
            case 'Home':
              iconName = 'store';
              break;
            case 'Order':
              iconName = 'shopping-basket';
              break;
            case 'Thích':
              iconName = 'heart';
              break;
            case 'Notifications':
              iconName = 'bell';
              break;
            case 'Profile':
              iconName = 'user';
              break;
            default:
              iconName = 'circle';
          }
          // Chuyển icon sang dạng đậm (solid) khi tab được chọn
          iconType = focused ? 'solid' : 'regular';

          return (
            <Icon
              name={iconName}
              size={focused ? 26 : 24} // Tăng nhẹ kích thước khi được chọn
              color={focused ? '#FF4500' : '#666666'} // Màu cam khi chọn và màu xanh khi không chọn
              solid={focused} // solid = true khi được chọn, tạo icon dạng đậm, solid = false tạo icon viền
            />
          );
        },
        tabBarLabel: ({ focused }) => {
          const labelColor = focused ? '#FF4500' : '#666666';
          return (
            <Text style={{ color: labelColor, fontSize: 12 }}>
              {route.name}
            </Text>
          );
        },
        tabBarStyle: {
          height: 85,
        },
        tabBarShowLabel: true,
        headerShown: false, // Ẩn tiêu đề của tất cả màn hình
        unmountOnBlur: true, // Xóa bộ nhớ cache khi tab không hoạt động
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Thích" component={ProductsFavorite} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
