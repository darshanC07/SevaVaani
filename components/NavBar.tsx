import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const NavBar = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>{t('common.appName')}</Text>
      <View style={styles.rightSide}>
        <Image
          source={require("../assets/navbar/notification.png")}
          style={{ width: 35, height: 35 }}
        />
        <LanguageSelector />
      </View>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4560F4",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    margin: 15,
  },
  rightSide: {
    flexDirection: "row",
    marginRight: 15,
  },
  languageIcon: {
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBlockColor:'black',
    backgroundColor:'#D7D3D3',
    borderRadius:10,
    paddingHorizontal:10,
    gap:5
  },
  lang: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
  },
});
