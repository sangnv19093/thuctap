import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';

const ToolBar = ({ title, onBackPress }) => {
    return (
        <SafeAreaView style={styles.toolbar}>
            <TouchableOpacity onPress={onBackPress}>
                <Image source={require('../Image/left_arrow.png')} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    toolbar: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderBottomWidth: 1, // Thêm đường line ở cuối
        borderBottomColor: '#ddd', // Màu của đường line
        backgroundColor: 'transparent', // Loại bỏ màu nền
    },
    backIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    title: {
        fontWeight: '500',
        fontSize: 20,
    },
});

export default ToolBar;
