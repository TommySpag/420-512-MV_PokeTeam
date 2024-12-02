import React from 'react'
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../contexts/ThemeContext';
import CustomDrawerHeader from '../components/CustomDrawerHeader';
import { ColorTypeProvider } from '../contexts/colorTypeContext';

// Import your global CSS file
import "../global.css"; 

const RootLayout = () => {
  return (
    <ThemeProvider>
      <ColorTypeProvider>
        <Layout/>
      </ColorTypeProvider>
    </ThemeProvider>
  )
}
const Layout = () => {

  return (
    <>
        <GestureHandlerRootView className="flex-1" >
          <Drawer 
              screenOptions={{
                swipeEnabled:false,
                header: ({navigation}) => <CustomDrawerHeader navigation={navigation} tabName={""} />
              }
            }>
              <Drawer.Screen name="index" options={{headerShown:false}} />
              <Drawer.Screen name="auth" options={{headerShown:false}} />
          </Drawer>
        </GestureHandlerRootView>
    </>
  )
}

export default RootLayout
