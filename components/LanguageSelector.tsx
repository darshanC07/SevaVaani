import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, SUPPORTED_LANGUAGES } from '../i18n';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ??
    SUPPORTED_LANGUAGES[0];

  const handleSelect = async (code: string) => {
    await changeLanguage(code);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.languageIcon}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Image
          source={require('../assets/navbar/language.png')}
          style={{ width: 30, height: 30 }}
        />
        <Text style={styles.lang}>{currentLang.nativeLabel.slice(0, 3).toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Select Language</Text>
            <FlatList
              data={SUPPORTED_LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    item.code === i18n.language && styles.menuItemActive,
                  ]}
                  onPress={() => handleSelect(item.code)}
                >
                  <Text
                    style={[
                      styles.menuItemText,
                      item.code === i18n.language && styles.menuItemTextActive,
                    ]}
                  >
                    {item.nativeLabel} ({item.label})
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  languageIcon: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7D3D3',
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 5,
  },
  lang: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: 300,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 6,
  },
  menuItemActive: {
    backgroundColor: '#4560F4',
  },
  menuItemText: {
    fontSize: 17,
    color: '#333',
  },
  menuItemTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});
