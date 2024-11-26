import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryItem from '../Item/HistoryItem';
import { URL } from '../const/const';
import ToolBar from '../components/ToolBar';
import { TabView, TabBar } from 'react-native-tab-view';
import Toast from 'react-native-toast-message';

const History = ({ navigation }) => {
    const [historyData, setHistoryData] = useState([]);
    const [dataUid, setDataUid] = useState('');
    const [index, setIndex] = useState(0);
    const [isCancel, setIsCancel] = useState(false);
    const [routes] = useState([
        { key: 'processing', title: 'Chờ xác nhận' },
        { key: 'confirm', title: 'Đã xác nhận' },
        { key: 'delivering', title: 'Đang Đá' },
        { key: 'delivered', title: 'Đã Xong' },
        { key: 'cancelled', title: 'Đã huỷ' }
    ]);

    const [refreshing, setRefreshing] = React.useState(false);

    


    // Lấy userId từ AsyncStorage
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userId = await AsyncStorage.getItem('_id');
                if (userId !== null) {
                    setDataUid(userId);
                }
            } catch (error) {
                console.error('Error fetching userId:', error);
            }
        };
        fetchUserId();
    }, []);
    // useEffect(() => {
    //     Toast.setRef(ref => Toast.setRef(ref));
    //   }, []);
      

    //fun call api data history
    const fetchDataHistory = async () => {
        try {
            const response = await fetch(URL+'api/history');
            const data = await response.json();
            const filteredData = data.filter(item => item.userId === dataUid);
            setHistoryData(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    console.log('iscc',isCancel);
    // Fetch lịch sử mua hàng và lọc dữ liệu trên client
    useEffect(() => {
        if (dataUid) {
            fetchDataHistory();
        }
        console.log("ls", historyData);
    }, [dataUid, isCancel]);
    
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchDataHistory();
        setTimeout(() => {
            if (historyData) {
                setRefreshing(false);
            }
        }, 2000);
    }, [historyData]);


    const renderScene = ({ route }) => {
        let filteredData = [];
        switch (route.key) {
            
            case 'processing':
                filteredData = historyData.filter(item => item.status === 0);
                break;
            case 'confirm':
                filteredData = historyData.filter(item => item.status === 1);
                break;
            case 'delivering':
                filteredData = historyData.filter(item => item.status === 2);
                break;
            case 'delivered':
                filteredData = historyData.filter(item => item.status === 3);
                break;
            case 'cancelled':
                filteredData = historyData.filter(item => item.status === 4); 
                break;
            default:
                return null;
        }
    
        return (
            <FlatList
                data={filteredData}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={({ item }) => <HistoryItem item={item} isCancel={isCancel} setIsCancel={setIsCancel} navigation={navigation} />}
                keyExtractor={item => item._id.toString()}
            />
        );
    };
    

    return (
        <SafeAreaView style={styles.container}>
        
            <ToolBar title="Lịch Sử Mua Hàng" onBackPress={() => navigation.goBack()} />

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: window.width }}
                renderTabBar={props => <TabBar {...props} />}
                />
                 
        </SafeAreaView>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    // Các styles khác của bạn
});

export default History;
