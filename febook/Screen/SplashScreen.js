import { View , StyleSheet, Image, Text} from 'react-native';
import React, { useEffect, useState, } from 'react';

const SplashScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            handleLogin();
        }
    }, [isLoading, navigation]);

    const handleLogin = async () => {
        navigation.replace('Appnavigator');
    };

    return (
        <View style={styles.container}>
            {/* <Image source={require('../Image/Logo_BeeFood.png')} style={styles.logo} /> */}
            <Text>
                Chào Mừng Bạn
            </Text>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logo: {
        alignSelf: 'center',
        width: 300 ,
        height: 200
    },
});