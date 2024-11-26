import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateProfile() {
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    // Lấy thông tin người dùng từ AsyncStorage nếu đã tồn tại
    getStoredUserData();
  }, []);

  const getStoredUserData = async () => {
    try {
      const storedPhone = await AsyncStorage.getItem('phone');
      const storedAvatar = await AsyncStorage.getItem('avatar');
      const storedGender = await AsyncStorage.getItem('gender');
      const storedBirthday = await AsyncStorage.getItem('birthday');

      if (storedPhone) {
        setPhone(storedPhone);
      }
      if (storedAvatar) {
        setAvatar(storedAvatar);
      }
      if (storedGender) {
        setGender(storedGender);
      }
      if (storedBirthday) {
        setBirthday(storedBirthday);
      }

      setIsProfileLoaded(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin từ AsyncStorage:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Cập nhật thông tin trong AsyncStorage
      await AsyncStorage.setItem('phone', phone);
      await AsyncStorage.setItem('avatar', avatar);
      await AsyncStorage.setItem('gender', gender);
      await AsyncStorage.setItem('birthday', birthday);

      Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      Alert.alert('Lỗi', 'Cập nhật thất bại');
    }
  };

  return (
    <View style={styles.container}>
      {isProfileLoaded ? (
        <>
          <TextInput
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={(text) => setPhone(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Avatar URL"
            value={avatar}
            onChangeText={(text) => setAvatar(text)}
            style={styles.input}
          />
          {avatar ? <Image source={{ uri: avatar }} style={styles.avatarImage} /> : null}
          <TextInput
            placeholder="Giới tính"
            value={gender}
            onChangeText={(text) => setGender(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Ngày sinh"
            value={birthday}
            onChangeText={(text) => setBirthday(text)}
            style={styles.input}
          />
          <Button title="Cập nhật thông tin" onPress={handleUpdateProfile} />
        </>
      ) : (
        <Text>Đang tải thông tin...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
});
