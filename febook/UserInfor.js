import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RadioButton } from 'react-native-paper';
import ToolBar from './components/ToolBar';

import { URL } from './const/const';

export default function UserInfor() {
    
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState({});
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [selectedGender, setSelectedGender] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        getStoredUserId();
    }, []);

    const getStoredUserId = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUserId = await AsyncStorage.getItem('_id');
            setToken(storedToken);
            setUserId(storedUserId);

            if (storedUserId) {
                fetchUserInfo(storedUserId);
            }
        } catch (error) {
            console.error('Lỗi khi lấy ID người dùng từ AsyncStorage:', error);
        }
    };

    const fetchUserInfo = async (user_Id) => {
        try {
            const response = await fetch(URL + `api/users/info/${user_Id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const userData = await response.json();
                setUserInfo(userData);
                setEditedUserInfo(userData);
                setSelectedGender(userData.gender);
            } else {
                console.error('Lỗi khi lấy thông tin người dùng từ máy chủ.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
    };

    const formatBirthday = (birthday) => {
        const date = new Date(birthday);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        setEditedUserInfo({
            ...editedUserInfo,
            birthday: date,
        });
    };
    

    // const pickImage = async () => {
    //     if (isEditing) {
    //         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //         if (status !== 'granted') {
    //             alert('Quyền truy cập thư viện ảnh bị từ chối!');
    //             return;
    //         }
    //
    //         const result = await ImagePicker.launchImageLibraryAsync({
    //             mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //             allowsEditing: true,
    //             aspect: [4, 3],
    //             quality: 1,
    //         });
    //
    //         if (!result.cancelled) {
    //             const formData = new FormData();
    //             formData.append('avatar', {
    //                 uri: result.uri,
    //                 type: 'image/jpeg',
    //                 name: 'avatar.jpg',
    //             });
    //
    //             try {
    //                 const response = await fetch(URL + `api/users/update-avatar/${userId}`, {
    //                     method: 'POST',
    //                     headers: {
    //                         Accept: 'application/json',
    //                         'Content-Type': 'multipart/form-data',
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                     body: formData,
    //                 });
    //
    //                 if (response.status === 200) {
    //                     const data = await response.json();
    //                     setEditedUserInfo({
    //                         ...editedUserInfo,
    //                         avatar: data.avatarPath,
    //                     });
    //                     Alert.alert('Thông báo', 'Cập nhật ảnh đại diện thành công');
    //                 } else {
    //                     Alert.alert('Lỗi', 'Cập nhật ảnh đại diện thất bại');
    //                 }
    //             } catch (error) {
    //                 console.error('Lỗi khi tải ảnh lên:', error);
    //             }
    //         }
    //     } else {
    //         alert('Bạn cần bật chế độ chỉnh sửa để thay đổi ảnh đại diện.');
    //     }
    // };
    
    const handleSaveChanges = async () => {
       // Kiểm tra nếu mật khẩu cũ hoặc mật khẩu mới không có giá trị
    if (!editedUserInfo.currentPassword) {
        return Alert.alert('Lỗi', 'Bạn cần nhập mật khẩu cũ để xác nhận.');
    }

    if (!editedUserInfo.password) {
        return Alert.alert('Lỗi', 'Bạn cần nhập mật khẩu mới.');
    }

        try {
            const updateData = {
                username: editedUserInfo.username,
                password: editedUserInfo.password,
                phone: editedUserInfo.phone,
                currentPassword: editedUserInfo.currentPassword, // Mật khẩu cũ
                gender: editedUserInfo.gender,
                birthday: editedUserInfo.birthday,
            };
    
            const response = await fetch(URL + `api/users/update/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });
    
            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);
    
            if (response.status === 200) {
                Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
                setIsEditing(false);
                fetchUserInfo(userId); // Làm mới thông tin hiển thị
            } else {
                 Alert.alert('Lỗi', responseData.error || 'Cập nhật thất bại');
            }
        } catch (error) {
           console.error('Lỗi khi cập nhật:', error);
           Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật thông tin.');
        }
    };
    


    const fieldsToDisplay = [
        {
            key: 'username',
            label: 'Tên người dùng',
            render: () =>
                (
                    <Text style={styles.text}>{userInfo.username}</Text>
                ),
        },
        {
            key: 'phone',
            label: 'Số điện thoại',
            render: () =>
                isEditing ? (
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nhập số điện thoại"
                        onChangeText={(text) =>
                            setEditedUserInfo({ ...editedUserInfo, phone: text })
                        }
                        value={editedUserInfo.phone || ''}
                    />
                ) : (
                    <Text style={styles.text}>{userInfo.phone}</Text>
                ),
        },
        {
            key: 'currentPassword',
            label: 'Mật khẩu cũ',
            render: () =>
                isEditing ? (
                    <TextInput
                        style={styles.textInput}
                        placeholder="Nhập mật khẩu cũ"
                        secureTextEntry
                        onChangeText={(text) =>
                            setEditedUserInfo({ ...editedUserInfo, currentPassword: text })
                        }
                        value={editedUserInfo.currentPassword || ''}
                    />
                ) : null,
        },
        {
            key: 'password',
            label: 'Xác nhận mật khẩu mới',
            render: () =>
                isEditing ? (
                    <TextInput
                        style={styles.textInput}
                        placeholder="Xác nhận mật khẩu mới"
                        secureTextEntry
                        onChangeText={(text) =>
                            setEditedUserInfo({ ...editedUserInfo, password: text })
                        }
                        value={editedUserInfo.password || ''}
                    />
                ) : null,
        },
        {
            key: 'birthday',
            label: 'Ngày sinh',
            render: () => (
                <View>
                    {isEditing ? (
                        <TouchableOpacity onPress={showDatePicker}>
                            <Text style={styles.text}>
                                {editedUserInfo.birthday
                                    ? formatBirthday(editedUserInfo.birthday)
                                    : 'Chọn ngày'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.text}>
                            {userInfo.birthday
                                ? formatBirthday(userInfo.birthday)
                                : ''}
                        </Text>
                    )}
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                    />
                </View>
            ),
        },
    ];
    
    return (
        <View style={styles.container}>
            <ToolBar title="Thông tin cá nhân" onBackPress={() => navigation.goBack()} />
             <ScrollView contentContainerStyle={styles.scrollContainer}>
            {userInfo ? (
                <View style={styles.horizontalContainer}>
                    <View style={styles.infoContainer}>
                        {fieldsToDisplay.map((field) => (
                            <View key={field.key} style={styles.textInfo}>
                                <Text style={{ color: 'gray', fontSize: 15, marginTop: 10}}>
                                    {field.label}
                                </Text>
                                {isEditing ? (
                                    field.render && field.render()
                                ) : (
                                    <Text style={styles.text}>
                                        {field.render
                                            ? field.render()
                                            : userInfo && userInfo[field.key]
                                                ? userInfo[field.key]
                                                : ''}
                                    </Text>
                                )}
                            </View>
                        ))}
                        <View >
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={() => setIsEditing(!isEditing)}
                            >
                                <Text style={{ fontSize: 20, color: '#ff0000' }}>
                                    {isEditing ? 'Hủy' : 'Chỉnh sửa thông tin'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <Text>Đang tải thông tin...</Text>
            )}

            {isEditing && (
                <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                    <Text style={styles.buttonText}>LƯU</Text>
                </TouchableOpacity>
            )}
              </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    horizontalContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 50,
    },
    avatarContainer: {
        width: '100%',
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        margin: 10,
    },
    infoContainer: {
        marginTop: 30,
        margin: 20,
        padding: 10,
        width: '100%',
    },
    textInfo: {
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
        padding:10,
        backgroundColor: '#f1f8fc',
        marginBottom:15,
        borderRadius:20,
        borderWidth:1
    },
    text: {
        fontSize: 18,

    },
    button: {
        backgroundColor: '#FF9900', // Màu nền xanh
        padding: 10,
        borderRadius: 5, // Bo góc
        margin: 10,
        alignItems: 'center',
        opacity: 0.8, // Hiệu ứng opacity
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btn: {
        backgroundColor: '#319AB4', // Màu nền xanh
        padding: 10,
        borderRadius: 5, // Bo góc
        marginTop: 10,
        alignItems: 'center',
        opacity: 0.8, // Hiệu ứng opacity
    },
    genderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    textInput: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 8,
        color: 'black',
    },
});
