// CustomDrawerHeader.js
import React from 'react';
import {Text, StyleSheet,TouchableOpacity, Image, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorsPalette } from '../assets/colorsPalette';
import Icon from 'react-native-vector-icons/FontAwesome5';


const CustomDrawerHeader = ({navigation, tabName}) => {
  const { theme, toggleTheme} = useTheme();
  const colors = colorsPalette[theme];
  return (
    <SafeAreaView style={[styles.header,{backgroundColor:colors.navBarBackground}]}>
        <TouchableOpacity style={[styles.content]} onPress={() => {navigation.navigate("index")}}>
        <Text>
            <Icon name="home" size={30} color={colors.navBarIcons}/>
        </Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={require('../assets/images/poketeamlogo.jpg')} />
      </View>
      <Text style={[styles.title,{color:colors.text}]}>{tabName}</Text>
      <TouchableOpacity style={[styles.content]} onPress={() => {toggleTheme()}}>
        <Text>
            <Icon name={theme == 'light' ? "moon" : "sun"} size={30} color={colors.navBarIcons}/>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width:'100%',
    justifyContent:'space-between'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content:{
    heigth:56,
    width:56,
    justifyContent:"center",
    alignItems:"center",
    fontSize:30
  },
  image: {
    width: 150,
    height: 75,
    resizeMode: 'contain',
  },
  imageContainer:{
    alignItems: 'center',
    justifyContent:"center",
    flex: 1
  }
});

export default CustomDrawerHeader;