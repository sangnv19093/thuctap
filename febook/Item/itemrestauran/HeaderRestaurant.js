import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
  Alert
} from "react-native";

const { width, height } = Dimensions.get("window");

const CoffeeShopScreen = ({ navigation, data }) => {
  // Hàm mở Google Maps chỉ đường
  const openGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(data.address); // Mã hóa địa chỉ để sử dụng trong URL
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url); // Mở URL chỉ đường
        } else {
          Alert.alert("Lỗi", "Không thể mở Google Maps trên thiết bị này.");
        }
      })
      .catch(err => console.error("Error opening Google Maps: ", err));
  };

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={{ uri: data.image }} // Thay thế bằng URL hình ảnh của bạn
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.overlay}>
          <View style={styles.butonheader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={require("./../../Image/path.png")} />
            </TouchableOpacity>
          </View>

          <View style={{ top: width * 0.3 }}>
            <Text style={styles.name}>{data.name}</Text>

            {/* Thêm TouchableOpacity vào địa chỉ */}
            <TouchableOpacity onPress={openGoogleMaps}>
              <Text style={[styles.address, { textDecorationLine: "underline" }]}>
                {data.address}
              </Text>
            </TouchableOpacity>

            <Text style={styles.address}>Call: {data.phone}</Text>
            <View style={styles.timeInfo}>
              <View style={styles.timeBlock}>
                <View style={styles.center}>
                  <Text style={styles.timeLabel}>Thời gian mở cửa</Text>
                  <Text style={styles.time}>
                    {data.timeon} AM
                  </Text>
                </View>

                <View
                  style={{
                    width: 1,
                    backgroundColor: "black",
                    height: height * 0.05,
                  }}
                ></View>
                <View style={styles.center}>
                  <Text style={styles.timeLabel}>Thời gian đóng cửa</Text>
                  <Text style={styles.time}>{data.timeoff} PM</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  imageBackground: {
    width: width,
    height: height * 0.4,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    flex: 1,
  },
  name: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  timeInfo: {
    flexDirection: "row",
  },
  timeBlock: {
    top: height * 0.06,
    width: width,
    right: width * 0.05,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 14,
    color: "#333",
  },
  time: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  butonheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: width * 0.02,
  },
});

export default CoffeeShopScreen;
