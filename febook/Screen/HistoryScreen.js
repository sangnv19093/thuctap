import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity} from 'react-native';

export default function HistoryScreen() {

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.text}>
                    <Text style={{color:'#616161',fontSize:27,fontWeight:'bold'}}>The Coffe House</Text>
                    <Text style={{fontSize:16,color:'#616161',marginTop:10}}>Chi tiết</Text>
                    <Text style={{fontSize:16,color:'#616161',marginTop:25}}>Thời gian</Text>
                    <Text style={{color:'#616161',fontSize:20,fontWeight:'bold',marginTop:20}}>Đã hoàn thành</Text>
                </View>
                <View style={styles.let}>
                    <TouchableOpacity
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Đặt lại</Text>
                    </TouchableOpacity>
                    <Text style={{marginTop:40,color:'#616161',fontSize:16}}>10/11/2023</Text>
                    <Text style={{marginTop:15,fontSize:25,color:'#616161',fontWeight:'bold'}}>100.000đ</Text>
                </View>
            </View>

            <View style={styles.content2}>
                <View style={styles.text}>
                    <Text style={{color:'#616161',fontSize:27,fontWeight:'bold'}}>The Coffe House</Text>
                    <Text style={{fontSize:16,color:'#616161',marginTop:10}}>Chi tiết</Text>
                    <Text style={{fontSize:16,color:'#616161',marginTop:25}}>Thời gian</Text>
                    <Text style={{color:'#616161',fontSize:20,fontWeight:'bold',marginTop:20}}>Đã hoàn thành</Text>
                </View>
                <View style={styles.let}>
                    <TouchableOpacity
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Đặt lại</Text>
                    </TouchableOpacity>
                    <Text style={{marginTop:40,color:'#616161',fontSize:16}}>10/11/2023</Text>
                    <Text style={{marginTop:15,fontSize:25,color:'#616161',fontWeight:'bold'}}>345.000đ</Text>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'flex-start',
    },
    content:{
        flexDirection:'row',
        backgroundColor:'#d3d3d3',
        height:190,
        padding:20,
        marginBottom:5,
        margin:20

    },
    content2:{
        flexDirection:'row',
        backgroundColor:'#d3d3d3',
        height:190,
        padding:20,
        marginBottom:25,
        margin:20
    },

    text:{

    },
    let:{
        paddingLeft:10,

    },
    button: {
        alignItems:'center',
        backgroundColor: '#ffa500', // Màu nền của nút
        padding: 10,
        borderRadius: 5,
        marginTop:2

    },
    buttonText: {
        fontSize: 20,
        color: 'white', // Màu chữ
    },



});
