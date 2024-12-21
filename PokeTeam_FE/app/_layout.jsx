import React from 'react'
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ColorTypeProvider } from '../contexts/colorTypeContext';
import { GenerationsProvider } from '../contexts/generationContext';
import { PokemonProvider } from '../contexts/pokemonContext';
import CustomDrawerHeader from '../components/CustomDrawerHeader';

// Import your global CSS file
import "../global.css"; 
import { LoadingProvider } from '../contexts/loadingContext';
import GlobalLoading  from "../components/GlobalLoading";

const RootLayout = () => {
  return (
    <ThemeProvider>
      <ColorTypeProvider>
        <GenerationsProvider>
          <PokemonProvider>
            <LoadingProvider>
              <GlobalLoading />
              <Layout/>
            </LoadingProvider>
          </PokemonProvider>
        </GenerationsProvider>
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
                // headerShown:false,
                header: ({navigation}) => <CustomDrawerHeader navigation={navigation} tabName={""} />
              }
            }>
              <Drawer.Screen name="index" options={{headerShown:true}} />
              <Drawer.Screen name="auth" options={{headerShown:true}} />
          </Drawer>
        </GestureHandlerRootView>
    </>
  )
}

export default RootLayout